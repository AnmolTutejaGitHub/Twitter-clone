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
const Auth = require('../middleware/Auth');
const config = require("../config/config");


app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// app.post('/login', async (req, res) => {
//     const { email, password, name } = req.body;
//     try {
//         const user = await User.findOne({ email, name });
//         if (!user) {
//             return res.status(400).send({ error: "Invalid Credentials" });
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatch) {
//             return res.status(400).send({ error: "Invalid Credentials" });
//         }

//         const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
//         res.status(200).send({ token });
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// });

// app.post('/signups', async (req, res) => {
//     const { email, password, name } = req.body;
//     try {
//         const user = new User({ email, password, name });
//         await user.save();
//         const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
//         res.status(200).send({ token });
//     } catch (e) {
//         res.status(400).send({ error: e.message });
//     }
// })

// app.post('/verifytokenAndGetUsername', async (req, res) => {
//     const { token } = req.body;

//     try {
//         const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
//         const user = await User.findById(decoded.user_id);

//         if (!user) {
//             return res.status(404).send({ error: 'Invalid or expired token' });
//         }

//         res.status(200).send({ user: user.name });
//     } catch (e) {
//         res.status(400).send({ error: 'Invalid or expired token' });
//     }
// });


// app.post('/otp', async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         let transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: "anmoltutejaserver@gmail.com",
//                 pass: process.env.NODEMAIL_APP_PASSWORD,
//             },
//         });

//         let mailOptions = {
//             from: "anmoltutejaserver@gmail.com",
//             to: email,
//             subject: 'Your login OTP',
//             text: `Your OTP is: ${otp}`,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return res.status(400).send(error);
//             }
//             res.status(200).send(otp);
//         });

//     } catch (error) {
//         res.status(400).send(error);
//     }
// });


app.post('/login',async (req, res) => {
    const { email,password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        
        if (!user.isVerified) {
            return res.status(401).json({ redirect: `${config.FRONTEND_URL}/verify` });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ user_id: user._id },config.JWT_TOKEN_SECRET, { expiresIn: '30d' });
        res.status(200).send({
            token: token,
            username: user.name,
            user_id : user._id
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.post('/signup',async (req, res) => {
    const { email, password,confirm_password, name } = req.body;
    try {
        if(password != confirm_password){
            return res.status(400).send({error : "Password Doesn't Match"});
        }
        const exist = await User.findOne({
            email : email
        })
        
        if(exist && !exist.isVerified) {
            const delc = await User.deleteOne({email : email});
            console.log(delc)
        }
        const profilePic = `https://api.dicebear.com/9.x/bottts/svg?seed=${name}`;
        const user = new User({ email,password,name,profilePic });
        await user.save();
        const token = jwt.sign({ user_id: user._id }, config.JWT_TOKEN_SECRET, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

app.post("/generate-Verification-Token", Auth, async (req, res) => {
    try {
      const id = req.userId;
      const user = await User.findById(id);
      const {email} = req.body;
  
      if (!user) {
        return res.status(400).send({ message: "Invalid user ID" });
      }

      if(email!=user.email){
        return res.status(400).send({ message: "signup email and this one doesn't match" });
      }
  
      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        config.JWT_TOKEN_SIGNUP_MAIL_SECRET,
        { expiresIn: "5m" }
      );
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: config.NODEMAILER_MAIL,
          pass: config.NODEMAIL_APP_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: `"X" <${config.NODEMAILER_MAIL}>`,
        to: user.email,
        subject: 'Email Verification Link',
        html: `
        <h3>Email Verification</h3>
        <p>Click the button below to verify your email:</p>
        <a 
            href="${config.FRONTEND_URL}/verify-email/${token}" 
            style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #000814; color: #ffffff; text-decoration: none; border-radius: 5px;"
        >
        Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${config.FRONTEND_URL}/verify-email/${token}</p>
        <p><b>Note:</b> This link is valid for only 5 minutes.</p>
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending mail:", error);
          return res.status(400).send({ message: "Error sending email", error });
        }
        res.status(200).send({ message: "Verification email sent. Check your inbox." });
      });
  
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(400).send({ message: err.message });
    }
  });

app.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, config.JWT_TOKEN_SIGNUP_MAIL_SECRET);
        if (!decoded) res.status(400).send({ message: "Invalid Token" });
        const user = await User.findById(decoded.user_id);
        if (!user) return res.status(400).send({ message: "Invalid Token" });
        if(user.isVerified) return res.status(200).send({ message: "User is already verified" })
        user.isVerified = true;
        await user.save();
        res.status(200).send({ message: "User has been verified" });
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post("/isVerified", async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findOne({ name: name });
        if (!user) return res.status(400).send({ message: "Invalid User" });
        res.status(200).send({
            verified: user.isVerified
        })
    } catch (err) {
        res.status(400).send(err);
    }
})


app.post('/resetPasswordToken', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).send({ error: 'Email is not registered with us' });
        const token = jwt.sign({ user_id: user._id, email: user.email }, config.JWT_RESET_PASSWORD_SECRET, { expiresIn: "5m" });
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: config.NODEMAILER_MAIL,
                pass: config.NODEMAIL_APP_PASSWORD,
            },
        });

        let mailOptions = {
            from: `"Twitter" <${config.NODEMAILER_MAIL}>`,
            to: email,
            subject: 'Password Reset Link',
            text: `You requested to reset your password. Click the link below to proceed. This link is valid for 5 minutes:\n\n${config.FRONTEND_URL}/update-password/${token}`,
            html: `
              <p>You requested to reset your password.</p>
              <p>This link is valid for <strong>5 minutes</strong>:</p>
              <a href="${config.FRONTEND_URL}/update-password/${token}">Reset Password</a>
            `,
          };
          

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).send(error);
            }
            res.status(200).send({ message: "Open Mail" });
        });

    } catch (e) {
        res.status(400).send(e);
    }
})

app.post("/resetPassword/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password,confirm_password } = req.body;

       if (confirm_password !== password) {
            return res.status(400).send("Passwords don't match");
        }

        
        const decoded = jwt.verify(token,config.JWT_RESET_PASSWORD_SECRET);
        if (!decoded || !decoded.user_id) {
            return res.status(400).send({ message: "Invalid or expired token" });
        }

    
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        
        user.password = password;
        await user.save();

        return res.status(200).send("success");
    } catch (err) {
        console.error(err);
        return res.status(400).send(err);
    }
})

app.post('/verifytokenAndGetUserDetails', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token,config.JWT_TOKEN_SECRET);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).send({ error: 'Invalid or expired token' });
        }

        if(!user.isVerified) return res.status(400).send({error : "Your Email is not verfied !"})

        res.status(200).send({ username : user.name , userid : user._id});
    } catch (e) {
        res.status(400).send({ error: 'Invalid or expired token' });
    }
})

app.post('/tweet',Auth, async (req, res) => {
    try{
    const { content, isQuote } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);

    const tweet = new Tweet({
        name: user.name,
        content: content,
        user_id: user._id
    })

    if (isQuote) tweet.isQuote = isQuote;
    await tweet.save();
    user.tweets.push(tweet._id.toString());
    await user.save();
    res.status(200).send(tweet);
    }catch(err){
        res.status(400).send(err);
    }
})

app.post('/addTweetreply', Auth, async (req, res) => {
    const { tweet_id, content } = req.body;

    try {
        const userid = req.userId;
        const tweet = await Tweet.findById(tweet_id);
       const user = await User.findById(userid);
        if (!tweet) return res.status(400).send("Tweet is deleted by the author");

        const reply = new Reply({
            name: user.name,
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

app.post('/addReplyReply',Auth, async (req, res) => {
    const { reply_id, content } = req.body;
    try {
        const userid = req.userId;
        const user = await User.findById(userid);
        const parent_reply = await Reply.findById(reply_id);
        if (!parent_reply) return res.status(400).send("Reply has been deleted");

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
    try {
        const {username}  = req.body
        const user = await User.findOne({ name:username });
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

app.post('/like',Auth, async (req, res) => {
    const { reply_id, tweet_id } = req.body;
    try {
         const userid = req.userId;
        const user = await User.findById(userid);

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

app.post('/unlike', Auth,async (req, res) => {
    const { reply_id, tweet_id } = req.body;
    try {
         const userid = req.userId;
        const user = await User.findById(userid);

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
    const tweets = await Tweet.find({}).sort({ createdAt: -1 });;
    res.status(200).send(tweets);
})

app.post('/usertweets', async (req, res) => {
    try{
        const { username } = req.body;
        const tweets = await Tweet.find({ name: username }).sort({ createdAt: -1 });;
        res.status(200).send(tweets);
    }catch(err){
        res.status(400).send(err);
    }
})
app.post('/userReplies', async (req, res) => {
    try{
        const { username } = req.body;
        const replies = await Reply.find({ name: username }).sort({ createdAt: -1 });;
        res.status(200).send(replies);
    }catch(err){
        res.status(400).send(err);
    }
})


app.post('/userlikes', async (req, res) => {
    try{
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
    }
    catch(err){
        res.status(400).send(err);
    }
})


app.post('/followAccount', Auth,async (req, res) => {
    try{
    const { creator } = req.body;
     const userid = req.userId;
     const user = await User.findById(userid);
    const Creator = await User.findOne({ name: creator });
    user.following.push(Creator._id.toString());
    await user.save();
    Creator.followers.push(user._id.toString());
    await Creator.save();
    res.status(200).send("Followed");
    }catch(err){res.status(400).send(err);}
})

app.post('/unfollowAccount',Auth, async (req, res) => {
    try{
    const { creator } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);
    const Creator = await User.findOne({ name: creator });

    user.following = user.following.filter(id => id !== Creator._id.toString());
    await user.save();
    Creator.followers = Creator.followers.filter(id => id !== user._id.toString());
    await Creator.save();
    res.status(200).send("Unfollowed");
    }catch(err){
        res.status(400).send(err);
    }
})

app.post('/isFollowed', Auth,async (req, res) => {
    try{
    const userid = req.userId;
    const user = await User.findById(userid);
    const {creator } = req.body;
    const Creator = await User.findOne({ name: creator });

    const isFollowing = user?.following?.includes(Creator._id.toString());
    if (isFollowing) res.status(200).send("following");
    else res.status(404).send('not following');
    }catch(err) {
        res.status(400).send(err);
    }
})

app.post('/getFollowersFollowing',async (req, res) => {
    try{
         const { username } = req.body;
        const user = await User.findOne({ name: username });
        res.status(200).send({ followers: user.followers, following: user.following });
    }catch(err){
        res.status(400).send(err);
    }
   
})


app.post('/getFollowingTweets', async (req, res) => {
    try{
    const { username } = req.body;
    const user = await User.findOne({ name: username });

    const followedAccounts_ids = user.following;

    const folowingTweets = await Tweet.find({
        user_id: { $in: followedAccounts_ids },
    }).sort({ createdAt: -1 });

    res.status(200).send(folowingTweets);
}
catch(err){
    res.status(400).send(err);
}
})

app.post('/addBookmark', Auth,async (req, res) => {
    const { tweet_id, reply_id } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);
    if (tweet_id) user.bookmarks.push(tweet_id);
    if (reply_id) user.bookmarks.push(reply_id);
    await user.save();
    res.status(200).send(user);
})

app.get('/getBookmarks',Auth, async (req, res) => {
     const userid = req.userId;
    const user = await User.findById(userid);
    res.status(200).send(user.bookmarks);
})

app.post('/deleteBookmark',Auth, async (req, res) => {
    const { tweet_id, reply_id } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);
    if (tweet_id) user.bookmarks = user.bookmarks.filter(id => id != tweet_id.toString());
    if (reply_id) user.bookmarks = user.bookmarks.filter(id => id != reply_id.toString());
    await user.save();
    res.status(200).send("Removed From Bookmark")
})

app.post('/isBookedmark', Auth,async (req, res) => {
    const { tweet_id, reply_id } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);

    if (tweet_id) {
        const isBookmarked = user?.bookmarks?.includes(tweet_id);
        if (isBookmarked) return res.status(200).send("Bookedmarked");
    }

    if (reply_id) {
        const isBookmarked = user?.bookmarks?.includes(reply_id);
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

app.post('/retweet',Auth, async (req, res) => {
    const { tweet_id } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);
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


app.post('/wasTweetLiked',Auth, async (req, res) => {
    const { post_id } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);
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

app.post('/changepassword',Auth, async (req, res) => {
    const {  oldPassword, newPassword } = req.body;
    const userid = req.userId;
    const user = await User.findById(userid);

    try {
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (isPasswordMatch) {
            user.password = newPassword;
            await user.save();
            return res.status(200).send("Password changed successsfully");
        } else res.status(400).send("Password does not match");
    } catch (e) {
        res.status(400).send(e);
    }
})

app.post('/isVerified', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ name: username });
    if (user.isVerified) return res.status(200).send("Verified");
    res.status(400).send("Not Verified");
})

// app.post('/verifyuser', async (req, res) => {
//     const { username } = req.body;
//     const user = await User.findOne({ name: username });
//     user.isVerified = true;
//     await user.save();
//     res.status(200).send("User Verfied");
// })

const io = socketio(server, {
    cors: {
        origin: `${process.env.FRONTEND_URL}`,
        credentials: true
    }
});

app.post('/explore', async (req, res) => {
    const { searchTerm } = req.body;
    const searchedTerm = searchTerm.trim().toLowerCase();

    try {
        const allUsers = await User.find();
        const allTweets = await Tweet.find();
        const allReplies = await Reply.find();

        const users = allUsers.filter(user =>
            user.name.toLowerCase().startsWith(searchedTerm)
        );

        const tweets = allTweets.filter(tweet =>
            tweet.content.toLowerCase().includes(searchedTerm)
        );

        const replies = allReplies.filter(reply =>
            reply.content.toLowerCase().includes(searchedTerm)
        );

        res.send({ users, tweets, replies });
    } catch (e) {
        res.status(400).send(e);
    }
});


app.post('/list', async (req, res) => {
    const { followers, following, username } = req.body;
    const user = await User.findOne({ name: username });

    if (followers) {
        const followerDetails = await Promise.all(user.followers.map(async (followerId) => {
            const follower = await User.findById(followerId, 'name');
            return follower.name;
        }));
        return res.status(200).send(followerDetails);
    }

    if (following) {
        const followingDetails = await Promise.all(user.following.map(async (followingId) => {
            const followingUser = await User.findById(followingId, 'name');
            return followingUser.name;
        }));
        return res.status(200).send(followingDetails);
    }
})

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