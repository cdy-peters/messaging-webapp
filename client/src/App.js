import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Register from './components/register';

const App = () => {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Register />} />
            </Routes>
        </div>
    )
}

export default App;