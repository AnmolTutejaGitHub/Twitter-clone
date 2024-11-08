const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    content: {
        type: String
    },
    media: {
        type: String
    },
    replies: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    }
})

const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;