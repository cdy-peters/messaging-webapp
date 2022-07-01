const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const User = require('../models/User')

router.get('/conversations', (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err
        res.json(users)
    })
})

module.exports = router