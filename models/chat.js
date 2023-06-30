const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    message: {
        type: String,
    },
    username: {
        type: String
    }
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;