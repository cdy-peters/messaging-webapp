const express = require('express');
const db = require('../db/conn');

const router = express.Router();

router.route('/register').post((req, res) => {
    const { username, email, password } = req.body;

    db.getDb().collection('users').insertOne({
        username,
        email,
        password
    }, (err, result) => {
        if (err) throw err
        res.send('User created successfully')
    });
})

module.exports = router;