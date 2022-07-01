import React from 'react';

import MessageHistory from './messageHistory';
import MessageField from './messageField';

const Messages = (props) => {
    const recipient = props.recipient

    return (
        <div>
            <h1>Messages</h1>
            <p>To: {recipient}</p>
            <p>From: {localStorage.getItem('token')}</p>
            <MessageHistory />
            <MessageField recipient={recipient} />
        </div>
    );
}

export default Messages;