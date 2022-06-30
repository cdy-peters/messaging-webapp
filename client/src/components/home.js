import React from 'react';

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
            }}>Logout</button>
        </div>
    );
}