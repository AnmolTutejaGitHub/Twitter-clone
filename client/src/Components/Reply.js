import { useState, useEffect } from "react";
import axios from 'axios';
import { FaRegComment } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";

function Reply({ reply }) {
    const [replierObj, setReplierObj] = useState({});
    async function getReplier(replier) {
        const response = await axios.post('http://localhost:6969/getUser', {
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
        console.log(currTime);
        console.log(createdTime);

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


    return (<div className="flex flex-col gap-3 p-3 border-[1px] border-[#2F3336]">
        <div className='flex gap-2'>
            <img src={`https://ui-avatars.com/api/?name=${reply.name}`} className='rounded-full h-8' />
            <div className="flex gap-1">
                <p>{reply.name}</p>
                <p className='text-[#71767A] text-sm'>@{replierObj._id}</p>
                <p className="text-[#71767A] text-sm">. {formatTime(reply.createdAt)}</p>
            </div>
        </div>

        <div>
            <p className="">{reply.content}</p>
        </div>

        <div className="flex justify-around text-[#71767A]">
            <FaRegComment />
            <FaRetweet />
            <FaRegHeart />
            <CiBookmark />
            <IoShareSocialOutline />
        </div>
    </div>)
}
export default Reply;