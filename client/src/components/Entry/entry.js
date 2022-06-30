import React from 'react';
import { Tabs, Tab } from 'react-bootstrap'
import PropTypes from 'prop-types';

import Register from './register';
import Login from './login';

export default function Entry({ setToken }) {
    return (
        <div>
            <Tabs defaultActiveKey="login" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="login" title="Login">
                    <Login setToken={setToken}/>
                </Tab>
                <Tab eventKey="register" title="Register">
                    <Register setToken={setToken}/>
                </Tab>
            </Tabs>
        </div>
    )
}

Entry.propTypes = {
    setToken: PropTypes.func.isRequired
}