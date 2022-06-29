import React from 'react';
import { Tabs, Tab } from 'react-bootstrap'

import Register from './register';
import Login from './login';

export default function Entry() {
    return (
        <div>
            <Tabs defaultActiveKey="login" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="login" title="Login">
                    <Login />
                </Tab>
                <Tab eventKey="register" title="Register">
                    <Register />
                </Tab>
            </Tabs>
        </div>
    )
}