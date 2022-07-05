import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

export default function Login({ setToken }) {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate()

    function updateForm(value) {
        // Clear any field errors on change
        if ('username' in value) {
            $('#l_username > p').attr('hidden', true);
        }
        if ('password' in value) {
            $('#l_password > p').attr('hidden', true);
        }

        return setForm((prev) => {
            return {
                ...prev,
                ...value
            }
        })
    }

    function validate_fields() {
        var valid = true;

        if (form.username === '') {
            $('#l_username > p').text('Please enter a username').attr('hidden', false);
            valid = false
        }

        if (form.password === '') {
            $('#l_password > p').text('Please enter a password').attr('hidden', false);
            valid = false
        }

        return valid
    }

    async function onSubmit(e) {
        e.preventDefault();
        
        const user = { ...form };

        if (!validate_fields()) {
            console.log('Invalid form')
            return
        }

        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if ('token' in data) {
                localStorage.setItem('username', user.username)
                setToken(data.token);
                navigate('/');
            } else {
                switch (data.error) {
                    case 'invalid_user':
                        $('#l_username > p').text('User does not exist').attr('hidden', false);
                        break;
                    case 'invalid_password':
                        $('#l_password > p').text('Incorrect password').attr('hidden', false);
                        break;
                    default:
                        console.log('Unknown error')
                }
            }
        })
        .catch(err => {
            console.error(err);
            return
        })

        navigate('/')
    }

    return (
        <div>
            <h3>Login</h3>
            <form className='form' id='login_form' onSubmit={onSubmit}>
                <div id='l_username'>
                    <label>Username:</label>
                    <input type="text" value={form.username} onChange={(e) => updateForm({ username: e.target.value })} />
                    <p className='field_error' hidden></p>
                </div>

                <div id='l_password'>
                    <label>Password:</label>
                    <input type="password" value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />
                    <p className='field_error' hidden></p>
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    )
}