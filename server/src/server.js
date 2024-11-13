require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const app = express();
require('../Database/mongoose');
const User = require('../Database/Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Tweet = require('../Database/Models/Tweet');
const Reply = require('../Database/Models/Reply');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Room = require('../Database/Models/Room');
const Message = require('../Database/Models/Message');


app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const PORT = process.env.PORT || 6969;

app.post('/login', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = await User.findOne({ email, name });
        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post('/signups', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = new User({ email, password, name });
        await user.save();
        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

app.post('/verifytokenAndGetUsername', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).send({ error: 'Invalid or expired token' });
        }

        res.status(200).send({ user: user.name });
    } catch (e) {
        res.status(400).send({ error: 'Invalid or expired token' });
    }
});


app.post('/otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "anmoltutejaserver@gmail.com",
                pass: process.env.NODEMAIL_APP_PASSWORD,
            },
        });

        let mailOptions = {
            from: "anmoltutejaserver@gmail.com",
            to: email,
            subject: 'Your login OTP',
            text: `Your OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).send(error);
            }
            res.status(200).send(otp);
        });

    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/tweet', async (req, res) => {
    const { username, content, isQuote } = req.body;
    const user = await User.findOne({ name: username });

    const tweet = new Tweet({
        name: username,
        content: content,
        user_id: user._id
    })

    if (isQuote) tweet.isQuote = isQuote;
    await tweet.save();
    user.tweets.push(tweet._id.toString());
    await user.save();
    res.status(200).send(tweet);
})

app.post('/addTweetreply', async (req, res) => {
    const { tweet_id, content, username } = req.body;

    try {
        const tweet = await Tweet.findById(tweet_id);
        const user = await User.findOne({ name: username });
        if (!tweet) return res.status(400).send("Tweet is deleted by the author");

        const reply = new Reply({
            name: username,
            content: content,
            parent_id: tweet_id,
            user_id: user._id
        })
        await reply.save();
        tweet.replies.push(reply._id);
        await tweet.save();

        res.status(200).send(reply);

    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

app.post('/addReplyReply', async (req, res) => {
    const { reply_id, content, username } = req.body;
    try {
        const parent_reply = await Reply.findById(reply_id);
        if (!parent_reply) return res.status(400).send("Reply has been deleted");

        const user = await User.findOne({ name: username });
        const reply = new Reply({
            name: username,
            content: content,
            parent_id: reply_id,
            user_id: user.id
        })
        await reply.save();
        parent_reply.replies.push(reply._id);
        await parent_reply.save();

        res.status(200).send(reply);

    } catch (e) {
        res.status(500).send(e)
    }
})

app.post('/getUser', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ name: username });
        if (!user) res.status(400).send({ message: "User does not exist" });

        else res.status(200).send(user);

    } catch (e) {
        res.status(400).send({ message: "User does not exist" });
    }
})

app.post('/getTweet', async (req, res) => {
    const { tweet_id } = req.body;
    try {
        const tweet = await Tweet.findById(tweet_id);
        if (!tweet) return res.status(400).send({ message: "Tweet does not exist" });
        res.status(200).send(tweet);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

app.post('/getReply', async (req, res) => {
    const { reply_id } = req.body;
    try {
        const reply = await Reply.findById(reply_id);
        if (!reply) return res.status(400).send({ message: "Reply does not exist" });
        res.status(200).send(reply);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

app.post('/like', async (req, res) => {
    const { reply_id, tweet_id, username } = req.body;
    try {
        const user = await User.findOne({ name: username });

        if (tweet_id) {
            const tweet = await Tweet.findById(tweet_id);
            if (!tweet) return res.status(400).send({ message: "Tweet deleted" });
            if (!user.likes.includes(tweet_id)) {
                tweet.likes += 1;
                await tweet.save();
                user.likes.push(tweet_id);
                await user.save();
            }
            return res.status(200).send({ message: "Tweet liked" });
        }

        if (reply_id) {
            const reply = await Reply.findById(reply_id);
            if (!reply) return res.status(400).send({ message: "Reply deleted" });
            if (!user.likes.includes(reply_id)) {
                reply.likes += 1;
                await reply.save();
                user.likes.push(reply_id);
                await user.save();
            }
            return res.status(200).send({ message: "Reply liked" });
        }
    } catch (e) {
        res.status(500).send(e);
    }
})

app.post('/unlike', async (req, res) => {
    const { reply_id, tweet_id, username } = req.body;
    try {
        const user = await User.findOne({ name: username });

        if (tweet_id) {
            const tweet = await Tweet.findById(tweet_id);
            if (!tweet) return res.status(400).send({ message: "Tweet deleted" });
            if (user.likes.includes(tweet_id)) {
                tweet.likes -= 1;
                await tweet.save();
                user.likes = user.likes.filter(id => id !== tweet_id);
                await user.save();
            }
            return res.status(200).send({ message: "Tweet unliked" });
        }

        if (reply_id) {
            const reply = await Reply.findById(reply_id);
            if (!reply) return res.status(400).send({ message: "Reply deleted" });
            if (user.likes.includes(reply_id)) {
                reply.likes -= 1;
                await reply.save();
                user.likes = user.likes.filter(id => id !== reply_id);
                await user.save();
            }
            return res.status(200).send({ message: "Reply unliked" });
        }
    } catch (e) {
        res.status(500).send(e);
    }
})

app.get('/alltweets', async (req, res) => {
    const tweets = await Tweet.find({});
    res.status(200).send(tweets);
})

app.post('/usertweets', async (req, res) => {
    const { username } = req.body;
    const tweets = await Tweet.find({ name: username });
    res.status(200).send(tweets);
})
app.post('/userReplies', async (req, res) => {
    const { username } = req.body;
    const replies = await Reply.find({ name: username });
    res.status(200).send(replies);
})


app.post('/userlikes', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    const likes = user.likes;

    const tweets = [];
    const replies = [];

    await Promise.all(likes.map(async (id) => {
        const tweet = await Tweet.findById(id);
        if (tweet) {
            tweets.push(tweet);
        } else {
            const reply = await Reply.findById(id);
            if (reply) {
                replies.push(reply);
            }
        }
    }));
    res.status(200).send({ tweets, replies });
})


app.post('/followAccount', async (req, res) => {
    const { username, creator } = req.body;
    const user = await User.findOne({ name: username });
    const Creator = await User.findOne({ name: creator });
    user.following.push(Creator._id.toString());
    await user.save();
    Creator.followers.push(user._id.toString());
    await Creator.save();
    res.status(200).send("Followed");
})

app.post('/unfollowAccount', async (req, res) => {
    const { username, creator } = req.body;
    const user = await User.findOne({ name: username });
    const Creator = await User.findOne({ name: creator });

    user.following = user.following.filter(id => id !== Creator._id.toString());
    await user.save();
    Creator.followers = Creator.followers.filter(id => id !== user._id.toString());
    await Creator.save();
    res.status(200).send("Unfollowed");
})

app.post('/isFollowed', async (req, res) => {
    const { username, creator } = req.body;
    const user = await User.findOne({ name: username });
    const Creator = await User.findOne({ name: creator });

    const isFollowing = user.following.includes(Creator._id.toString());
    if (isFollowing) res.status(200).send("following");
    else res.status(404).send('not following');
})

app.post('/getFollowersFollowing', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    res.status(200).send({ followers: user.followers, following: user.following });
})


app.post('/getFollowingTweets', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });

    const followedAccounts_ids = user.following;

    const folowingTweets = await Tweet.find({
        user_id: { $in: followedAccounts_ids },
    }).sort({ createdAt: -1 });

    res.status(200).send(folowingTweets);
})

app.post('/addBookmark', async (req, res) => {
    const { username, tweet_id, reply_id } = req.body;
    const user = await User.findOne({ name: username });
    if (tweet_id) user.bookmarks.push(tweet_id);
    if (reply_id) user.bookmarks.push(reply_id);
    await user.save();
    res.status(200).send(user);
})

app.post('/getBookmarks', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    res.status(200).send(user.bookmarks);
})

app.post('/deleteBookmark', async (req, res) => {
    const { username, tweet_id, reply_id } = req.body;
    const user = await User.findOne({ name: username });
    if (tweet_id) user.bookmarks.filter(id => id != tweet_id.toString());
    if (reply_id) user.bookmarks.filter(id => id != reply_id.toString());
    await user.save();
    res.status(200).send("Removed From Bookmark")
})

app.post('/isBookedmark', async (req, res) => {
    const { username, tweet_id, reply_id } = req.body;
    const user = await User.findOne({ name: username });

    if (tweet_id) {
        const isBookmarked = user.bookmarks.includes(tweet_id);
        if (isBookmarked) return res.status(200).send("Bookedmarked");
    }

    if (reply_id) {
        const isBookmarked = user.bookmarks.includes(reply_id);
        if (isBookmarked) return res.status(200).send("Bookedmarked");
    }

    res.status(400).send("Not Booked marked");
})

app.post('/findTweetorReplyById', async (req, res) => {
    const { id } = req.body;
    const tweet = await Tweet.findById(id);
    if (tweet) {
        return res.status(200).send({ type: "tweet", tweet });
    }
    const reply = await Reply.findById(id);
    if (reply) {
        return res.status(200).send({ type: "reply", reply });
    }
    res.status(404).send({ message: "Not found" });
})

app.post('/retweet', async (req, res) => {
    const { username, tweet_id } = req.body;
    const user = await User.findOne({ name: username });
    user.reTweeted.push({
        tweet_id: tweet_id
    });
    await user.save();
    res.status(200).send(user);
})

app.post('/tweetReplies', async (req, res) => {
    const { tweet_id } = req.body;
    const tweet = await Tweet.findById(tweet_id);
    if (!tweet) return res.status(400).send("no tweet found")
    const replies = await Reply.find({ parent_id: tweet._id });
    return res.status(200).send(replies);
})

app.post('/replyReplies', async (req, res) => {
    const { reply_id } = req.body;
    const reply = await Reply.findById(reply_id);
    if (!reply) return res.status(400).send("reply has been deleted");
    const replies = await Reply.find({ parent_id: reply._id });
    return res.status(200).send(replies);
})


app.post('/wasTweetLiked', async (req, res) => {
    const { username, post_id } = req.body;
    const user = await User.findOne({ name: username });
    if (user.likes.includes(post_id)) return res.status(200).send("Liked");
    res.status(400).send("Not Liked");
})

app.post('/findParentPost', async (req, res) => {
    const { parent_id } = req.body;
    const tweet = await Tweet.findById(parent_id);
    if (tweet) {
        return res.status(200).send({ type: "tweet", tweet });
    }
    const reply = await Reply.findById(parent_id);
    if (reply) {
        return res.status(200).send({ type: "reply", reply });
    }
    res.status(404).send({ message: "Not found" });
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        resource_type: 'auto',
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
    const { tweet_id } = req.body;
    const tweet = await Tweet.findById(tweet_id);
    tweet.fileURL = req.file?.path || null;
    await tweet.save();
    res.status(200).send({ message: 'File uploaded successfully!', url: tweet.fileURL });
});


app.post('/incQuote', async (req, res) => {
    const { tweet_id, retweet_id } = req.body;
    const tweet = await Tweet.findById(tweet_id);
    tweet.reTweetes += 1;
    tweet.reTweets_id.push(retweet_id);
    await tweet.save();
    res.status(200).send("retweeted/Quoted");
})


app.post('/findUser', async (req, res) => {
    const { searchUser } = req.body;
    try {
        const user = await User.findOne({ name: searchUser.trim() });
        if (!user) res.status(400).send({ message: "User does not exist" });

        else res.status(200).send(user._id.toString());

    } catch (e) {
        res.status(400).send({ message: "User does not exist" });
    }
})

app.post('/createOrGetDMRoom', async (req, res) => {
    const Sender = await User.findOne({ name: req.body.sender });
    const Receiver = await User.findOne({ name: req.body.receiver });

    if (!Sender.chatted.includes(req.body.receiver)) Sender.chatted.push(req.body.receiver);
    if (!Receiver.chatted.includes(req.body.sender)) Receiver.chatted.push(req.body.receiver);

    await Sender.save();
    await Receiver.save();

    try {
        const room = new Room({ name: req.body.room_name })
        await room.save();
        res.status(200).send(room);
    } catch (e) {
        // --> already created
        res.status(200).send({ message: "already DMed once" });
    }
})

app.post('/getFriends', async (req, res) => {
    const username = req.body.user;
    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user.chatted);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

app.post('/roomMessages', async (req, res) => {
    const room = req.body.room_name;
    try {
        const messages = await Message.find({ room_name: room }).sort({ date: 1 });
        res.send(messages);
    } catch (err) {
        res.status(400).send(e);
    }
})



const io = socketio(server, {
    cors: {
        origin: `http://localhost:3000`,
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('clinet has joined');

    socket.on('joinDM', async ({ sender, receiver, room }) => {
        try {
            socket.join(room);
        } catch (e) {
            console.log(e);
        }
    })

    socket.on('SendDMMessage', async ({ room_name, msg, sender }) => {
        const date = new Date();
        const timestamp = date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Asia/Kolkata'
        });

        io.to(room_name).emit('DMMessage', { msg, sender, timestamp });
        const message = new Message({ room_name, message: msg, username: sender, timestamp, date: date });
        await message.save();
    })


    socket.on('disconnect', () => {
        console.log('client has left');
    })
})


server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})