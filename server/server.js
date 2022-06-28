require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(require('./routes/entry'));

const db = require('./db/conn')

app.listen(port, () => {
    db.connectToServer((err) => {
        if (err) console.error(err)
    })

    console.log(`Server is running on port ${port}`);
})