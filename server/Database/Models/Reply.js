const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [String], // reply_id
    likes: {
        type: String
    },
    content: {
        type: String
    },
    parent_id: [String],
    likes: {
        type: Number,
        default: 0
    }
})

const Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;