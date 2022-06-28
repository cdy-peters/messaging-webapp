const express = require('express');
const db = require('../db/conn');

const router = express.Router();

router.route('/register').post(async (req, res) => {
    const { username, email, password } = req.body;

    const email_existence = await db.getDb().collection('users').findOne({ email })
    const username_existence = await db.getDb().collection('users').findOne({ username })

    if (email_existence || username_existence) {
        console.log('Email or username taken')
        res.send({
            email: email_existence,
            username: username_existence,
        });
    } else {
        db.getDb().collection('users').insertOne({
            username,
            email,
            password
        }, (err, result) => {
            if (err) throw err
            console.log(result)
            res.send('User created successfully')
        });
    }
})

router.route('/login').post((req, res) => {
    const { username, password } = req.body;

    db.getDb().collection('users').findOne({
        username
    }, (err, user) => {
        if (err) throw err

        if (!user) {
            console.log('User does not exist')
        } else if (user.password !== password) {
            console.log('Password is incorrect')
        } else {
            console.log('User logged in successfully')
        }
        res.send('User logged in successfully')
    });
})

module.exports = router;