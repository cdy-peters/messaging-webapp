import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

var email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var username_regex = /^[a-zA-Z0-9_-]{3,20}$/;
var password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default function Register({ setToken }) {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate()

    function updateForm(value) {
        // Clear any field errors on change
        if ('email' in value) {
            $('#r_email > p').attr('hidden', true);
        }
        if ('username' in value) {
            $('#r_username > p').attr('hidden', true);
        }
        if ('password' in value) {
            $('#r_password > p').attr('hidden', true);
        }
        if ('confirmPassword' in value) {
            $('#r_confirmPassword > p').attr('hidden', true);
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

        if (form.email === '') {
            $('#r_email > p').text('Please enter an email').attr('hidden', false);
            valid = false
        } else if (!email_regex.test(form.email)) {
            $('#r_email > p').text('Invalid email').attr('hidden', false);
            valid = false
        }

        if (form.username === '') {
            $('#r_username > p').text('Please enter a username').attr('hidden', false);
            valid = false
        } else if (!username_regex.test(form.username)) {
            $('#r_username > p').text('Invalid username').attr('hidden', false);
            valid = false
        }

        if (form.password === '') {
            $('#r_password > p').text('Please enter a password').attr('hidden', false);
            valid = false
        } else if (!password_regex.test(form.password)) {
            $('#r_password > p').text('Invalid password').attr('hidden', false);
            valid = false
        }

        if (form.password !== '') {
            if (form.confirmPassword === '') {
                $('#r_confirmPassword > p').text('Please confirm your password').attr('hidden', false);
                valid = false
            } else if (form.confirmPassword !== form.password) {
                $('#r_confirmPassword > p').text('Passwords do not match').attr('hidden', false);
                valid = false
            }
        }

        return valid
    } 

    async function onSubmit(e) {
        e.preventDefault();
        
        const newUser = { ...form };

        if (!validate_fields()) {
            console.log('Invalid form')
            return
        }

        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(data => {
            if ('token' in data) {
                setToken(data.token);
                navigate('/');
            } else {
                if (data.email_existence) {
                    $('#r_email > p').text('Email already in use').attr('hidden', false);
                }
                if (data.username_existence) {
                    $('#r_username > p').text('Username taken').attr('hidden', false);
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
            <h3>Register</h3>
            <form className='form' id='register_form' onSubmit={onSubmit}>
                <div id='r_email'>
                    <label>Email:</label>
                    <input type="text" value={form.email} onChange={(e) => updateForm({ email: e.target.value })} />
                    <p className='field_error' hidden></p>
                </div>

                <div id='r_username'>
                    <label>Username:</label>
                    <input type="text" value={form.username} onChange={(e) => updateForm({ username: e.target.value })} />
                    <p className='field_error' hidden></p>
                </div>

                <div id='r_password'>
                    <label>Password:</label>
                    <input type="password" value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />
                    <p className='field_error' hidden></p>
                </div>

                <div id='r_confirmPassword'>
                    <label>Confirm Password:</label>
                    <input type="password" value={form.confirmPassword} onChange={(e) => updateForm({ confirmPassword: e.target.value })} />
                    <p className='field_error' hidden></p>
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    )
}