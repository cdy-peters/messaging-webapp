import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (props) => {
    const conversationId = props.conversationId || null;
    const recipientId = props.recipientId || null;

    return (
        <div>
            <h1>Messages</h1>
            <p>To: {conversationId || recipientId}</p>
            <p>From: {localStorage.getItem('token')}</p>
            <MessageHistory />
            <MessageField conversationId={conversationId} recipientId={recipientId} />
        </div>
    );
}

export default Messages;