const express = require('express');
const mongoose = require('mongoose');

const Conversations = require('../models/Conversations');

const router = express.Router();

router.post('/messages', (req, res) => {
    const { recipient, sender, message } = req.body;

    console.log(recipient, sender);

    const newMessage = new Conversations({
        recipients: [recipient, sender],
        messages: [
            {
                sender: sender,
                message: message,
            },
        ],
    });

    newMessage
        .save()
        .then(message => {
            // req.io.sockets.emit('message', message);
            res.json(message);
        })
        .catch(err => {
            res.send(err);
        });


});

module.exports = router;