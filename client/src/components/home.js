import React from 'react';

import Messages from './Messages/messages';

export default function Home() {
    return (
        <div>
            <Messages />

            <button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
            }}>Logout</button>
        </div>
    );
}