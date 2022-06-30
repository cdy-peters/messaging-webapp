import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = () => {
    return (
        <div>
            <h1>Messages</h1>
            <MessageHistory />
            <MessageField />
        </div>
    );
}

export default Messages;