const express = require('express');

const router = express.Router();

router.post('/messages', (req, res) => {
    const { message } = req.body;

    console.log(message)
    req.io.sockets.emit('message', message);
});

module.exports = router;