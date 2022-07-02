import React, { useState } from 'react';


const MessageField = (props) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationId: props.conversationId,
                senderId: localStorage.getItem('token'),
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