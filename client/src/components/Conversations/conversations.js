import React, { useState, useEffect } from 'react';

import Messages from '../Messages/messages';

const Conversations = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null);

    const handleClick = (e) => {
        setSelectedRecipient(e.target.value);
    }

    useEffect(() => {
        async function getConversations() {
            const response = await fetch('http://localhost:5000/conversations');
            const data = await response.json();

            setConversations(data);
        }
        getConversations();
    }, []);

    return (
        <div>
            <h1>Conversations</h1>

            {conversations.map((conversation) => (
                <button key={conversation._id} value={conversation._id} onClick={handleClick}>
                    {conversation.username}
                </button>
            ))}

            <Messages recipient={selectedRecipient} />

        </div>
    )
}

export default Conversations;