import { useState, useEffect } from "react";
import axios from 'axios';
import { FaRegComment } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoMdBookmark } from "react-icons/io";
import useUserStore from "../store/userStore";


function Reply({ reply }) {
    const [replierObj, setReplierObj] = useState({});
    const [isLiked, setLiked] = useState(false);
   const { username,isAuthenticated,clearUser,userid } = useUserStore();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    async function getReplier(replier) {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getUser`, {
            username: replier
        })
        setReplierObj(response.data);
    }

    useEffect(() => {
        getReplier(reply.name);
    }, [])

    function formatTime(createdTime) {
        const currTime = new Date();
        const diff = currTime - createdTime;

        const hours = diff / (1000 * 60 * 60);

        if (hours < 24) {
            return `${Math.floor(hours)}h`;
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
            reply_id: reply._id,
        },{
         headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setLiked(true);
        reply.likes += 1;
    }

    async function unLikeThePost() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/unlike`, {
            reply_id: reply._id,
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setLiked(false);
        reply.likes -= 1;
    }

    async function wasPostLiked() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wasTweetLiked`, {
                post_id: reply._id,
            },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            if (response.status == 200) setLiked(true);
        } catch (e) { }
    }

    async function BookmarkTweet(e) {
        e.stopPropagation();
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addBookmark`, {
            reply_id: reply._id,
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setIsBookmarked(true);
    }

    async function unBookmarkTweet(e) {
        e.stopPropagation();
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/deleteBookmark`, {
            reply_id: reply._id,
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setIsBookmarked(false);
    }

    async function isBookedmarked() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/isBookedmark`, {
                reply_id: reply._id,
            },{
            headers: {
                Authorization: `Bearer ${token}`
            }
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

    async function GoToParentPost(parent_id) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/findParentPost`, {
                parent_id: parent_id
            })
            if (response.status == 200) {
                if (response.data.type == 'tweet') navigate('/home/tweet', { state: { tweet: response.data.tweet } });
                if (response.data.type == 'reply') navigate('/home/reply', { state: { reply: response.data.reply } });
            }
        } catch (e) {
            console.log(e);
        }
    }


    return (<div className="flex flex-col gap-3 p-3 border-[1px] border-[#2F3336]" onClick={() => navigate('/home/reply', { state: { reply } })}>
        <div className='flex gap-2'>
            <img src={`https://ui-avatars.com/api/?name=${reply.name}`} className='rounded-full h-8' onClick={(e) => { e.stopPropagation(); navigate('/home/profile', { state: { user: reply.name } }) }} />
            <div className="flex gap-1">
                <p>{reply.name}</p>
                <p className='text-[#71767A] text-sm'>@{replierObj._id}</p>
                <p className="text-[#71767A] text-sm">. {formatTime(reply.createdAt)}</p>
            </div>
        </div>
        <div className="text-[13px] text-blue-500" onClick={(e) => { e.stopPropagation(); GoToParentPost(reply.parent_id) }}>replying to post id: {reply.parent_id}</div>

        <div>
            <p className="break-all">{reply.content}</p>
        </div>

        <div className="flex justify-around text-[#71767A]">
            <div className="flex items-center gap-1 hover:text-sky-500">
                <FaRegComment />
                {reply.replies.length > 0 && reply.replies.length}
            </div>
            <div className="flex items-center gap-1 hover:text-green-500">
                <FaRetweet />
            </div>
            <div className="flex items-center gap-1 hover:text-red-500" >
                {!isLiked &&
                    <>
                        <FaRegHeart onClick={(e) => { e.stopPropagation(e); LikeThePost() }} />
                        {reply.likes > 0 && reply.likes}
                    </>
                }
                {isLiked &&
                    <>
                        <IoMdHeart className="text-red-500" onClick={(e) => { e.stopPropagation(e); unLikeThePost() }} />
                        <div className="text-red-500">{reply.likes}</div>
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
    </div>)
}
export default Reply;