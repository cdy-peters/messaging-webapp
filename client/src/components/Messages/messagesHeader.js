import React from 'react';

const MessagesHeader = (props) => {
    const { username } = props;

    return (
        <div id='messages-header'>
            <h3>{username}</h3>
        </div>
    );
}

export default MessagesHeader;