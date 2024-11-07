const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [this],
    likes: {
        type: String
    }
})

module.exports = ReplySchema;