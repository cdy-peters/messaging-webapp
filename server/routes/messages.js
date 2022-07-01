const express = require('express');
const mongoose = require('mongoose');

const Conversations = require('../models/Conversations');

const router = express.Router();

router.post('/messages', (req, res) => {
    const { conversationId, senderId, message } = req.body;

    console.log(req.body);

    // Add message to conversation
    Conversations.findByIdAndUpdate(conversationId, {
        $push: {
            messages: {
                sender: senderId,
                message: message
            }
        }
    }, { new: true }, (err, conversation) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(conversation);
        }
    });



    // const newMessage = new Conversations({
    //     recipients: [recipientId, senderId],
    //     messages: [
    //         {
    //             sender: senderId,
    //             message: message,
    //         },
    //     ],
    // });

    // newMessage
    //     .save()
    //     .then(message => {
    //         // req.io.sockets.emit('message', message);
    //         res.json(message);
    //     })
    //     .catch(err => {
    //         res.send(err);
    //     });


});

module.exports = router;