import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Entry from './components/entry';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Entry />} />
            </Routes>
        </div>
    )
}

export default App;