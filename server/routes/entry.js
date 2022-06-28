const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/conn');

const router = express.Router();

router.route('/register').post(async (req, res) => {
    const { username, email, password } = req.body;

    const email_existence = await db.getDb().collection('users').findOne({ email }) ? true : false;
    const username_existence = await db.getDb().collection('users').findOne({ username }) ? true : false;

    if (email_existence || username_existence) {
        res.send({
            email_existence: email_existence,
            username_existence: username_existence,
        });
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        db.getDb().collection('users').insertOne({
            username,
            email,
            hash,
        }, (err, result) => {
            if (err) throw err
            console.log(result)
            res.send({
                email_existence: false,
                username_existence: false,
            })
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
            res.json({msg: 'User does not exist'})
        } else if (!bcrypt.compareSync(password, user.hash)) {
            res.json({msg: 'Password is incorrect'})
        } else {
            res.json({msg: 'User logged in'})
        }
    });
})

module.exports = router;