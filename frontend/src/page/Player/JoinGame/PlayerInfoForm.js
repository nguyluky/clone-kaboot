import React, { useState, useEffect } from 'react';

export default function PlayerInfoForm({ addPlayer, initialCode = '', codeReadOnly = false }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        sdt: '',
        code: initialCode || '',
    });

    useEffect(() => {
        // Update code when initialCode prop changes
        setFormData(prev => ({
            ...prev,
            code: initialCode || ''
        }));
    }, [initialCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, sdt, code } = formData;
        addPlayer(name, email, sdt, code);
    };

    return (
        <form className="player-info-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />
            </div>

            <div className="form-group">
                <label htmlFor="sdt">Phone Number</label>
                <input
                    type="tel"
                    id="sdt"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                />
            </div>

            <div className="form-group">
                <label htmlFor="code">Game Code {codeReadOnly && '(Selected Quiz)'}</label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter game code"
                    readOnly={codeReadOnly}
                    className={codeReadOnly ? 'readonly' : ''}
                    required
                />
            </div>

            <button type="submit" className="join-button">
                Join Game
            </button>
        </form>
    );
}
