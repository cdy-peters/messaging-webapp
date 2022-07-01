const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const User = require('../models/User')
const Conversations = require('../models/Conversations')

router.post('/get_conversations', (req, res) => {
    const { userId } = req.body

    Conversations.find({ recipients: userId }, (err, conversations) => {
        if (err) throw err

        res.json(conversations)
    }
    )
})

router.post('/get_users', (req, res) => {
    const { userId } = req.body
    
    User.find({ _id: { $ne: userId } }, (err, users) => {
        if (err) throw err

        res.json(users)
    })
})

router.post('/get_messages', (req, res) => {
    const { conversationId, recipientId } = req.body
    
    Conversations.findOne({ _id: conversationId }, (err, conversation) => {
        if (err) throw err

        res.json(conversation.messages)
    })
});

router.post('/send_message', (req, res) => {
    const { conversationId, recipientId, senderId, message } = req.body;

    console.log(req.body)

    if (conversationId) {
        Conversations.findOneAndUpdate({ _id: conversationId }, { $push: { messages: { sender: senderId, message: message } } }, (err, conversation) => {
            if (err) throw err

            res.json(conversation)
        }
        )
    } else {
        const newConversation = new Conversations({
            recipients: [recipientId, senderId],
            messages: [{ sender: senderId, message: message }]
        })

        newConversation.save((err, conversation) => {
            if (err) throw err

            res.json(conversation)
        }
        )
    }

    // Conversations.findByIdAndUpdate(conversationId, {
    //     $push: {
    //         messages: {
    //             sender: senderId,
    //             message: message
    //         }
    //     }
    // }, { new: true }, (err, conversation) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send(err);
    //     } else {
    //         res.status(200).send(conversation);
    //     }
    // });



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

module.exports = router