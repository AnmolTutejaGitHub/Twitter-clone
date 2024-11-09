import { useEffect, useState } from "react";
import Post from "./Post/Post";
import axios from 'axios';
import Reply from "./Reply";
import { useLocation } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';

function Tweet() {
    const [replies, setreplies] = useState([]);
    const location = useLocation();
    const tweet = location.state.tweet;
    const [showbtn, setshowbtn] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    async function getReplies() {
        const response = await axios.post('http://localhost:6969/tweetReplies', {
            tweet_id: tweet._id
        })
        setreplies(response.data);
    }

    useEffect(() => {
        getReplies();
    }, [])

    const renderReplies = replies.map((reply) => {
        return <Reply reply={reply} />
    })

    function autoResize(e) {
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    return (<div>
        <div className="p-4 text-lg font-bold flex gap-4 items-center">
            <IoMdArrowRoundBack onClick={() => window.history.back()} />
            <p>Post</p>
        </div>
        <Post tweet={tweet} />
        <div className="border-[1px] border-[#2F3336] flex items-center pr-1">
            <img src={`https://ui-avatars.com/api/?name=${user}`} className='rounded-full h-8' />
            <textarea placeholder="Post Your Reply" className=" p-2 h-10 focus:outline-none bg-inherit w-full resize-none" onInput={autoResize} />
            <button className="p-1 pl-2 pr-2 rounded-lg bg-[#1C9BEF] h-8 flex-shrink-0">Reply</button>
        </div>
        {renderReplies}
    </div>)
}
export default Tweet;