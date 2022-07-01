import React from 'react';

import Conversations from './Conversations/conversations';

export default function Home() {
    return (
        <div>
            <Conversations />

            <button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
            }}>Logout</button>
        </div>
    );
}