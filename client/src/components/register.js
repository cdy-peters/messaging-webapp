import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate()

    function updateForm(value) {
        return setForm((prev) => {
            return {
                ...prev,
                ...value
            }
        })
    }

    async function onSubmit(e) {
        e.preventDefault();
        
        const newUser = { ...form };

        await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
        .catch(err => {
            console.error(err);
            return
        })

        setForm({ email: '', username: '', password: '', confirmPassword: '' });
        navigate('/')
    }

    return (
        <div>
            <h3>Register</h3>
            <form onSubmit={onSubmit}>
                <label>Email:</label>
                <input type="text" value={form.email} onChange={(e) => updateForm({ email: e.target.value })} />
                <label>Username:</label>
                <input type="text" value={form.username} onChange={(e) => updateForm({ username: e.target.value })} />
                <label>Password:</label>
                <input type="password" value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />
                <label>Confirm Password:</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => updateForm({ confirmPassword: e.target.value })} />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}