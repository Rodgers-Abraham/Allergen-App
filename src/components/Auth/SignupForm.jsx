import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, saveTheme } from '../../lib/storage';
import { COMMON_ALLERGENS } from '../../lib/mockDatabase';
import { User, Shield, AlertTriangle, Camera, Phone } from 'lucide-react';

const SignupForm = () => {
    const navigate = useNavigate();
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
            // Default theme
            saveTheme('light');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center', paddingBottom: '60px' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img src="/logo.png" alt="My Allergy Diary Logo" style={{ width: '60px', height: '60px' }} />
                </div>
                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginTop: 0 }}>Join My Allergy Diary</h2>

                {error && <p style={{ color: 'var(--color-danger)', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div style={{ textAlign: 'center' }}>
                        <label htmlFor="profile-upload" style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%',
                                backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', border: '2px solid var(--color-primary)'
                            }}>
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Camera size={40} color="#ccc" />
                                )}
                            </div>
                            <div style={{
                                position: 'absolute', bottom: 0, right: 0,
                                background: 'var(--color-primary)', borderRadius: '50%',
                                padding: '4px', color: 'white'
                            }}>
                                <Camera size={16} />
                            </div>
                        </label>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        <p style={{ fontSize: '0.8em', color: '#666' }}>Tap to add photo</p>
                    </div>

                    <label>
                        Full Name
                        <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                    </label>

                    <label>
                        Nickname
                        <input
                            type="text"
                            name="nickname"
                            required
                            value={formData.nickname}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                    </label>

                    <label>
                        Phone Number
                        <input
                            type="tel"
                            name="phoneNumber"
                            required
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        />
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px', background: 'var(--color-bg)', borderRadius: '8px' }}>
                        <input
                            type="checkbox"
                            name="isChild"
                            checked={formData.isChild}
                            onChange={handleChange}
                            id="isChild"
                        />
                        <label htmlFor="isChild" style={{ fontWeight: 'bold' }}>I am a Child (Under 13)</label>
                    </div>

                    {formData.isChild && (
                        <div style={{ padding: '10px', border: '1px solid var(--color-secondary)', borderRadius: '8px', background: '#fff3cd' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#856404' }}>
                                <Shield size={16} style={{ verticalAlign: 'middle' }} /> Parental Consent Required
                            </p>
                            <label>
                                Parent/Guardian Email
                                <input
                                    type="email"
                                    name="parentEmail"
                                    required={formData.isChild}
                                    value={formData.parentEmail}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                                />
                            </label>
                        </div>
                    )}

                    <div>
                        <h3>Your Allergens</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                            {COMMON_ALLERGENS.map(allergen => (
                                <button
                                    key={allergen}
                                    type="button"
                                    onClick={() => handleAllergenToggle(allergen)}
                                    style={{
                                        background: formData.allergens.includes(allergen) ? 'var(--color-danger)' : 'var(--color-surface)',
                                        color: formData.allergens.includes(allergen) ? 'white' : 'var(--color-text)',
                                        border: '1px solid var(--color-border)',
                                        fontSize: '0.9em',
                                        padding: '6px 12px'
                                    }}
                                >
                                    {allergen}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Add other allergen..."
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
                                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const input = document.getElementById('customAllergen');
                                    const val = input.value.trim();
                                    if (val && !formData.allergens.includes(val)) {
                                        handleAllergenToggle(val);
                                        input.value = '';
                                    }
                                }}
                                className="btn-primary"
                                style={{ padding: '8px 16px' }}
                            >
                                Add
                            </button>
                        </div>

                        {/* Show selected custom allergens that are NOT in common list */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}>
                            {formData.allergens.filter(a => !COMMON_ALLERGENS.includes(a)).map(allergen => (
                                <span
                                    key={allergen}
                                    style={{
                                        background: 'var(--color-danger)',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '16px',
                                        fontSize: '0.9em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {allergen}
                                    <button
                                        type="button"
                                        onClick={() => handleAllergenToggle(allergen)}
                                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, marginLeft: '4px' }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
