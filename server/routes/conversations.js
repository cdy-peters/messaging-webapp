const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const User = require('../models/User')
const Conversations = require('../models/Conversations')

router.post('/conversations', (req, res) => {
    const { userId } = req.body

    Conversations.find({ recipients: userId }, (err, conversations) => {
        if (err) throw err

        res.json(conversations)
    }
    )
})

module.exports = router