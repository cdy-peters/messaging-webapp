import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (props) => {
    const conversationId = props.conversationId;

    return (
        <div>
            <h1>{conversationId}</h1>
            <MessageHistory conversationId={conversationId} />
            <MessageField conversationId={conversationId} />
        </div>
    );
}

export default Messages;