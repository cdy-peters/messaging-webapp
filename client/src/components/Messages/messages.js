import React from 'react';

import MessagesHeader from './messagesHeader';
import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (props) => {
    const { conversationId, username } = props.selectedConversation;

    return (
        <div>
            {/* <h3>{username}</h3> */}
            <MessagesHeader username={username} />

            <MessageHistory conversationId={conversationId} />
            <MessageField conversationId={conversationId} />
        </div>
    );
}

export default Messages;