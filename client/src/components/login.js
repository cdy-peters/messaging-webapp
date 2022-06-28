import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({
        username: '',
        password: ''
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
        
        const user = { ...form };

        await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .catch(err => {
            console.error(err);
            return
        })

        setForm({ username: '', password: '' });
        navigate('/login')
    }

    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={onSubmit}>
                <label>Username:</label>
                <input type="text" value={form.username} onChange={(e) => updateForm({ username: e.target.value })} />
                <label>Password:</label>
                <input type="password" value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}