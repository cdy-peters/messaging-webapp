const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    }
}
, {
    timestamps: true
}
);

module.exports = mongoose.model('User', userSchema);