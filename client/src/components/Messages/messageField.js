import React, { useState } from 'react';


const MessageField = () => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: newMessage
            })
        })
        
        setNewMessage('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Send message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button type="submit">Send</button>
        </form>
    )
}

export default MessageField;