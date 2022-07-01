import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (props) => {
    const conversationId = props.conversationId;

    return (
        <div>
            <h1>Messages</h1>
            <p>To: {conversationId}</p>
            <p>From: {localStorage.getItem('token')}</p>
            <MessageHistory />
            <MessageField conversationId={conversationId} />
        </div>
    );
}

export default Messages;