import { FaRegComment } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import axios from 'axios';
import { useState } from "react";
import { IoMdHeart } from "react-icons/io";
import { useEffect } from "react";
import { IoMdBookmark } from "react-icons/io";

function Post({ tweet }) {

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [isLiked, setLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    function formatTime(createdTime) {
        const currTime = new Date();
        const diff = currTime - new Date(createdTime);

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            if (hours > 0) {
                return `${hours}h ago`;
            } else if (minutes > 0) {
                return `${minutes}m ago`;
            } else {
                return `${seconds}s ago`;
            }
        } else {
            return currTime.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
    }


    async function LikeThePost() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/like`, {
            tweet_id: tweet._id,
            username: user
        });
        setLiked(true);
        tweet.likes += 1;
    }

    async function unLikeThePost() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/unlike`, {
            tweet_id: tweet._id,
            username: user
        });
        setLiked(false);
        tweet.likes -= 1;
    }

    async function wasPostLiked() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wasTweetLiked`, {
                post_id: tweet._id,
                username: user
            })
            if (response.status == 200) setLiked(true);
        } catch (e) { }
    }

    async function BookmarkTweet(e) {
        e.stopPropagation();
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addBookmark`, {
            username: user,
            tweet_id: tweet._id
        })
        setIsBookmarked(true);
    }

    async function unBookmarkTweet(e) {
        e.stopPropagation();
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/deleteBookmark`, {
            username: user,
            tweet_id: tweet._id
        })
        setIsBookmarked(false);
    }

    async function isBookedmarked() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/isBookedmark`, {
                username: user,
                tweet_id: tweet._id
            })
            if (response.status == 200) setIsBookmarked(true);
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        wasPostLiked();
        isBookedmarked();
    }, [])



    return (<div className="flex flex-col gap-3 p-3 border-[1px] border-[#2F3336]" onClick={() => navigate('/home/tweet', { state: { tweet } })}>
        <div className='flex gap-2'>
            <img src={`https://ui-avatars.com/api/?name=${tweet.name}`} className='rounded-full h-8' onClick={(e) => { e.stopPropagation(); navigate('/home/profile', { state: { user: tweet.name } }) }} />
            <div className="flex gap-1">
                <p>{tweet.name}</p>
                <p className='text-[#71767A] text-sm'>@{tweet.user_id}</p>
                <p className="text-[#71767A] text-sm">. {formatTime(tweet.createdAt)}</p>
            </div>
        </div>

        <div>
            <p className="">{tweet.content}</p>
            {tweet?.isQuote?._bool &&
                <div className="text-blue-500 cursor-pointer text-[13px]" onClick={(e) => { e.stopPropagation(); navigate('/home/tweet', { state: { tweet: tweet.isQuote.parent } }) }}>Quote to post_id : {tweet.isQuote.parent._id}</div>
            }


            {
                tweet.fileURL && (
                    tweet.fileURL.endsWith('.jpg') || tweet.fileURL.endsWith('.png') || tweet.fileURL.endsWith('.jpeg') || tweet.fileURL.endsWith('.webp')
                ) ? (
                    <img src={tweet.fileURL} className="max-h-64" alt="Tweet media" />
                ) : tweet.fileURL && (tweet.fileURL.endsWith('.mp4') || tweet.fileURL.endsWith('.webm')) ? (
                    <video className="max-h-64" controls>
                        <source src={tweet.fileURL} type="video/mp4" />
                        <source src={tweet.fileURL.replace('.mp4', '.webm')} type="video/webm" />
                    </video>
                ) : tweet.fileURL && tweet.fileURL.endsWith('.mp3') ? (
                    <audio className="max-h-64" controls>
                        <source src={tweet.fileURL} type="audio/mp3" />
                    </audio>
                ) : tweet.fileURL ? (
                    <a href={tweet.fileURL} target="_blank" className="text-blue-500">Open File</a>
                ) : null
            }


        </div>

        <div className="flex justify-around text-[#71767A]">
            <div className="flex items-center gap-1 hover:text-sky-500">
                <FaRegComment />
                {tweet.replies.length > 0 && tweet.replies.length}
            </div>
            <div className="flex items-center gap-1 hover:text-green-500" onClick={(e) => { e.stopPropagation(); navigate('/home/quote', { state: { tweet } }) }}>
                <FaRetweet />
            </div>
            <div className="flex items-center gap-1 hover:text-red-500" >
                {!isLiked &&
                    <>
                        <FaRegHeart onClick={(e) => { e.stopPropagation(e); LikeThePost() }} />
                        {tweet.likes > 0 && tweet.likes}
                    </>
                }
                {isLiked &&
                    <>
                        <IoMdHeart className="text-red-500" onClick={(e) => { e.stopPropagation(e); unLikeThePost() }} />
                        <div className="text-red-500">{tweet.likes}</div>
                    </>
                }
            </div>
            <div className={"flex items-center gap-1 hover:text-sky-500"}>
                {!isBookmarked && <CiBookmark onClick={(e) => BookmarkTweet(e)} />}
                {isBookmarked && <IoMdBookmark onClick={(e) => unBookmarkTweet(e)} className="text-[#1C90DF]" />}
            </div>
            <div className="flex items-center gap-1 hover:text-sky-500">
                <IoShareSocialOutline />
            </div>
        </div>
    </div >)
}
export default Post;