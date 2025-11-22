import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, saveUser, clearUser } from '../../lib/storage';
import { COMMON_ALLERGENS } from '../../lib/mockDatabase';
import { ArrowLeft, Camera, LogOut, Save } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const user = getUser();
        if (!user) {
            navigate('/');
            return;
        }
        setFormData(user);
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleSave = (e) => {
        e.preventDefault();
        saveUser(formData);
        setMessage('Profile saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSignOut = () => {
        navigate('/');
    };

    if (!formData) return null;

    return (
        <div className="container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <ArrowLeft size={24} color="var(--color-text)" />
                </button>
                <h2 style={{ margin: 0 }}>Edit Profile</h2>
            </header>

            <div className="card">
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ textAlign: 'center' }}>
                        <label htmlFor="profile-upload-edit" style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}>
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
                            id="profile-upload-edit"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <label>
                        <strong>Full Name</strong>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', marginTop: '4px' }}
                        />
                    </label>

                    <label>
                        <strong>Nickname</strong>
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', marginTop: '4px' }}
                        />
                    </label>

                    <div>
                        <strong>Your Allergens</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', marginBottom: '1rem' }}>
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
                                        padding: '8px 16px'
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
                                id="customAllergenProfile"
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
                                    const input = document.getElementById('customAllergenProfile');
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Save size={20} /> Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            style={{
                                background: 'transparent',
                                color: 'var(--color-danger)',
                                border: '1px solid var(--color-danger)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>

                    {message && (
                        <p style={{ textAlign: 'center', color: 'var(--color-primary)', fontWeight: 'bold' }}>{message}</p>
                    )}

                </form>
            </div>
        </div>
    );
};

export default UserProfile;
