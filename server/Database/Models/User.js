const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('please provide valid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })) {
                throw new Error("Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one symbol.");
            }
        }
    },
    profilePic: {
        type: String
    },
    backdropPic: {
        type: String
    },
    followers: [String],
    following: [String],
    bio: {
        type: String
    },
    JoinedDate: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    tweets: [String], // id
    likes: [String],
    bookmarks: [String],
    reTweeted: [
        {
            tweet_id: {
                type: String,
            },
            reTweetedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    chatted: [String]
})

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});


const User = mongoose.model('User', UserSchema);
module.exports = User;