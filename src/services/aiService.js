import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 * @param {File} file 
 * @returns {Promise<Object>}
 */
async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Analyzes an image for allergens using Google Gemini.
 * @param {File} imageFile - The image file to analyze.
 * @param {Array<string>} userAllergens - List of allergens to check against.
 * @returns {Promise<{isSafe: boolean, detectedAllergens: string[], safeAlternatives: string[]}>}
 */
export const analyzeImage = async (imageFile, userAllergens) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const imagePart = await fileToGenerativePart(imageFile);
        const allergensList = userAllergens.join(", ");

        const prompt = `Identify the ingredients in this image. Compare them against this list of allergens: [${allergensList}]. Return a JSON object with: { isSafe: boolean, detectedAllergens: [], safeAlternatives: [] }. Do not include markdown formatting, just the raw JSON string.`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up text if it contains markdown code blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw new Error("Failed to analyze image. Please try again.");
    }
};

/**
 * Sends a message to the Allergen Buddy chatbot.
 * @param {string} message - The user's message.
 * @param {Array<string>} userAllergens - List of user's allergens.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} history - Chat history.
 * @returns {Promise<string>} - The bot's response.
 */
export const chatWithBuddy = async (message, userAllergens, history = []) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const allergensList = userAllergens.join(", ");
        const systemInstruction = `You are "Allergen Buddy", a friendly and helpful AI assistant for someone with the following allergens: [${allergensList}]. 
        Your goal is to help them find safe foods, suggest alternatives, and answer questions about their allergies. 
        Be encouraging but cautious. Always remind them to check labels physically. 
        Keep responses concise and easy to read. Use emojis occasionally.`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `System Instruction: ${systemInstruction}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Got it! I'm ready to help as Allergen Buddy. 🛡️" }],
                },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error chatting with Buddy:", error);
        return "I'm having trouble connecting right now. Please try again later! 😓";
    }
};
