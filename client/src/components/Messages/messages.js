import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (props) => {
    const conversationId = props.conversationId || null;
    const recipientId = props.recipientId || null;

    return (
        <div>
            <h1>{conversationId || recipientId}</h1>
            <MessageHistory conversationId={conversationId} />
            <MessageField conversationId={conversationId} recipientId={recipientId} />
        </div>
    );
}

export default Messages;