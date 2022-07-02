import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (props) => {
    const { conversationId, username } = props.selectedConversation;

    return (
        <div>
            <h1>{username}</h1>
            <MessageHistory conversationId={conversationId} />
            <MessageField conversationId={conversationId} />
        </div>
    );
}

export default Messages;