import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { getUser } from '../../lib/storage';
import { chatWithBuddy } from '../../services/aiService';
// Wait, previous file was src/services/aiService.js. I should check where it is imported from usually or just use relative path.
// The user asked for src/services/aiService.js but previous edits might have been mixed. 
// Let's stick to the file I just edited: src/services/aiService.js
// But wait, the previous file edit was to c:\Codes\Allergen App\src\services\aiService.js
// I need to make sure I import from there.

const AllergenBuddy = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hi! I'm Allergen Buddy. I know about your allergies. Ask me anything about food! 🍎" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [userAllergens, setUserAllergens] = useState([]);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const user = getUser();
        if (user && user.allergens) {
            setUserAllergens(user.allergens);
        }
        scrollToBottom();
    }, []);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // Format history for Gemini (excluding the initial greeting if it's local only, but here we can just pass the conversation so far)
        // The service handles the system prompt, so we just pass the user/model exchange.
        // Gemini expects { role: "user" | "model", parts: [{ text: "..." }] }
        const historyForApi = messages.slice(1).map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        try {
            const responseText = await chatWithBuddy(input, userAllergens, historyForApi);
            const botMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            let errorMessage = "Sorry, I couldn't reach the server. 😔";

            if (error.message && error.message.includes('API key')) {
                errorMessage = "⚠️ API Key Error: Please check your .env file and restart the server.";
            }

            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
            {/* Header */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0 }}>Allergen Buddy</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>Online</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        {msg.role === 'model' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                <Bot size={16} />
                            </div>
                        )}
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '16px',
                            backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: msg.role === 'user' ? 'white' : 'var(--color-text)',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ alignSelf: 'flex-start', marginLeft: '40px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        Buddy is typing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about food..."
                    style={{
                        flex: 1,
                        padding: '12px 20px',
                        borderRadius: '24px',
                        border: '1px solid var(--color-border)',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: loading ? 'default' : 'pointer',
                        opacity: loading || !input.trim() ? 0.5 : 1
                    }}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default AllergenBuddy;
