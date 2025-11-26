import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, saveTheme } from '../../lib/storage';
import { COMMON_ALLERGENS } from '../../lib/mockDatabase';
import { Shield, Camera, Heart, Star, Smile, ArrowLeft } from 'lucide-react';

// --- DATA: The Fun Slides (Join Us Version) ---
const SLIDES = [
    {
        id: 1,
        title: "Join the Squad",
        desc: "Become an Allergen Hunter today! Create your profile to start scanning.",
        icon: <Star size={80} color="#fff" />,
        bgColor: "#FF9AA2" // Pastel Red/Pink
    },
    {
        id: 2,
        title: "Stay Safe",
        desc: "Customize your allergen list so we can warn you exactly when it matters.",
        icon: <Heart size={80} color="#fff" />,
        bgColor: "#B5EAD7" // Pastel Green
    },
    {
        id: 3,
        title: "Have Fun",
        desc: "Play games, earn badges, and learn about food safety in a cool way.",
        icon: <Smile size={80} color="#fff" />,
        bgColor: "#C7CEEA" // Pastel Purple
    }
];

const SignupForm = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [currentSlide, setCurrentSlide] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        password: '',
        isChild: false,
        parentEmail: '',
        allergens: [],
        profilePicture: null
    });
    const [error, setError] = useState('');

    // --- AUTO-SLIDER LOGIC ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    // --- FORM HANDLERS (Unchanged Logic) ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAllergenToggle = (allergen) => {
        setFormData(prev => {
            const newAllergens = prev.allergens.includes(allergen)
                ? prev.allergens.filter(a => a !== allergen)
                : [...prev.allergens, allergen];
            return { ...prev, allergens: newAllergens };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.isChild && !formData.parentEmail) {
            alert("Parent's email is required for child accounts.");
            return;
        }

        try {
            registerUser(formData);
            saveTheme('light');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>

            {/* --- LEFT SIDE: THE FUN SLIDER --- */}
            <div style={{ ...styles.sliderSection, backgroundColor: SLIDES[currentSlide].bgColor }}>
                <div style={styles.sliderContent}>
                    <div style={styles.iconWrapper}>
                        {SLIDES[currentSlide].icon}
                    </div>
                    <h2 style={styles.slideTitle}>{SLIDES[currentSlide].title}</h2>
                    <p style={styles.slideDesc}>{SLIDES[currentSlide].desc}</p>

                    <div style={styles.dotsContainer}>
                        {SLIDES.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                style={{
                                    ...styles.dot,
                                    backgroundColor: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.4)',
                                    transform: currentSlide === idx ? 'scale(1.2)' : 'scale(1)'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: SIGNUP FORM (Scrollable) --- */}
            <div style={styles.formSection}>
                <div style={styles.formContainer}>
                    <div style={styles.header}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: '#666', textDecoration: 'none', marginBottom: '10px' }}>
                            <ArrowLeft size={16} style={{ marginRight: '5px' }} /> Back to Login
                        </Link>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333' }}>Create Account</h1>
                        <p style={{ color: '#666' }}>Start your journey with us</p>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>

                        {/* Profile Picture */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <label htmlFor="profile-upload" style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}>
                                <div style={styles.profileCircle}>
                                    {formData.profilePicture ? (
                                        <img src={formData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Camera size={40} color="#ccc" />
                                    )}
                                </div>
                                <div style={styles.cameraBadge}>
                                    <Camera size={14} />
                                </div>
                            </label>
                            <input id="profile-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>Tap to add photo</p>
                        </div>

                        {/* Text Fields */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nickname</label>
                            <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={styles.input} placeholder="+1234567890" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
                        </div>

                        {/* Child Checkbox */}
                        <div style={styles.childBox}>
                            <input type="checkbox" name="isChild" checked={formData.isChild} onChange={handleChange} id="isChild" style={{ width: '20px', height: '20px' }} />
                            <label htmlFor="isChild" style={{ fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>I am a Child (Under 13)</label>
                        </div>

                        {formData.isChild && (
                            <div style={styles.parentBox}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.85em', color: '#856404', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Shield size={16} /> Parental Consent Required
                                </p>
                                <label style={styles.label}>Parent/Guardian Email</label>
                                <input type="email" name="parentEmail" required={formData.isChild} value={formData.parentEmail} onChange={handleChange} style={styles.input} />
                            </div>
                        )}

                        {/* Allergens Section */}
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Your Allergens</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                {COMMON_ALLERGENS.map(allergen => (
                                    <button
                                        key={allergen}
                                        type="button"
                                        onClick={() => handleAllergenToggle(allergen)}
                                        style={{
                                            ...styles.allergenTag,
                                            background: formData.allergens.includes(allergen) ? '#ef4444' : '#f3f4f6',
                                            color: formData.allergens.includes(allergen) ? 'white' : '#333',
                                            border: formData.allergens.includes(allergen) ? 'none' : '1px solid #ddd'
                                        }}
                                    >
                                        {allergen}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Allergen Input */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Add other..."
                                    id="customAllergen"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = e.target.value.trim();
                                            if (val && !formData.allergens.includes(val)) {
                                                handleAllergenToggle(val);
                                                e.target.value = '';
                                            }
                                        }
                                    }}
                                    style={{ ...styles.input, flex: 1 }}
                                />
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => {
                                        const input = document.getElementById('customAllergen');
                                        const val = input.value.trim();
                                        if (val && !formData.allergens.includes(val)) {
                                            handleAllergenToggle(val);
                                            input.value = '';
                                        }
                                    }}
                                    style={{ padding: '0 20px', borderRadius: '12px' }}
                                >
                                    Add
                                </button>
                            </div>

                            {/* Show Custom Tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                {formData.allergens.filter(a => !COMMON_ALLERGENS.includes(a)).map(allergen => (
                                    <span key={allergen} style={styles.customTag}>
                                        {allergen}
                                        <button type="button" onClick={() => handleAllergenToggle(allergen)} style={styles.closeBtn}>×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={styles.submitBtn}>
                            Create Account
                        </button>

                    </form>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

// --- STYLES OBJECT ---
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', sans-serif",
        height: '100vh', // Fixed height to enable scroll on right side only
        overflow: 'hidden'
    },
    // Left Slider
    sliderSection: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        transition: 'background-color 0.5s ease',
        position: 'relative',
    },
    sliderContent: {
        textAlign: 'center',
        padding: '40px',
        maxWidth: '400px',
        animation: 'fadeIn 0.5s ease-in-out',
    },
    iconWrapper: {
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto',
    },
    slideTitle: { fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '800' },
    slideDesc: { fontSize: '1.1rem', lineHeight: '1.5', opacity: 0.9, marginBottom: '30px' },
    dotsContainer: { display: 'flex', gap: '10px', justifyContent: 'center' },
    dot: { width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.3s ease' },

    // Right Form
    formSection: {
        flex: 1,
        backgroundColor: '#fff',
        padding: '40px 20px',
        overflowY: 'auto' // Crucial: Allows scrolling only on the form side
    },
    formContainer: { width: '100%', maxWidth: '450px', margin: '0 auto' },
    header: { marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', color: '#444', fontSize: '0.85rem', fontWeight: '600' },
    input: {
        width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
    },

    // Profile Pic Styles
    profileCircle: {
        width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f0f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        border: '3px solid #28a745', margin: '0 auto'
    },
    cameraBadge: {
        position: 'absolute', bottom: 0, right: 'calc(50% - 50px)',
        background: '#28a745', borderRadius: '50%', padding: '6px', color: 'white'
    },

    // Checkboxes & Allergens
    childBox: { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '15px' },
    parentBox: { padding: '15px', border: '1px solid #ffeeba', borderRadius: '8px', background: '#fff3cd', marginBottom: '15px' },
    allergenTag: {
        padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer',
        transition: 'all 0.2s', fontWeight: '500'
    },
    customTag: {
        background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '16px',
        fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px'
    },
    closeBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, fontSize: '1.2rem', lineHeight: 1 },

    submitBtn: {
        marginTop: '30px', padding: '14px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold',
        cursor: 'pointer', border: 'none', backgroundColor: '#28a745', color: 'white',
        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)', width: '100%'
    },
    error: {
        backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px',
        marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center'
    },
};

export default SignupForm;