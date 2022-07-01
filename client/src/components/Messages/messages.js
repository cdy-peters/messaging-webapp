import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (recipient) => {
    return (
        <div>
            <h1>Messages</h1>
            <p>To: {recipient.recipient}</p>
            <p>From: {localStorage.getItem('token')}</p>
            <MessageHistory />
            <MessageField />
        </div>
    );
}

export default Messages;