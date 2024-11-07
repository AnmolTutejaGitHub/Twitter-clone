const mongoose = require("mongoose");
const ReplySchema = require('../Models/Replies');

const TweetSchema = new mongoose.Schema({
    content: {
        type: String
    },
    media: {
        type: String
    },
    replies: [ReplySchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    }
})

module.exports = TweetSchema;