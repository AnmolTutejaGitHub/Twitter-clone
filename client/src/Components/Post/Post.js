import { FaRegComment } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

function Post({ tweet }) {

    const navigate = useNavigate();

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


    return (<div className="flex flex-col gap-3 p-3 border-[1px] border-[#2F3336]" onClick={() => navigate('/home/tweet', { state: { tweet } })}>
        <div className='flex gap-2'>
            <img src={`https://ui-avatars.com/api/?name=${tweet.name}`} className='rounded-full h-8' />
            <div className="flex gap-1">
                <p>{tweet.name}</p>
                <p className='text-[#71767A] text-sm'>@{tweet.user_id}</p>
                <p className="text-[#71767A] text-sm">. {formatTime(tweet.createdAt)}</p>
            </div>
        </div>

        <div>
            <p className="">{tweet.content}</p>
        </div>

        <div className="flex justify-around text-[#71767A]">
            <div className="flex items-center gap-1 hover:text-sky-500">
                <FaRegComment />
                {tweet.replies.length > 0 && tweet.replies.length}
            </div>
            <div className="flex items-center gap-1 hover:text-green-500">
                <FaRetweet />
            </div>
            <div className="flex items-center gap-1 hover:text-red-500">
                <FaRegHeart />
            </div>
            <div className="flex items-center gap-1 hover:text-sky-500">
                <CiBookmark />
            </div>
            <div className="flex items-center gap-1 hover:text-sky-500">
                <IoShareSocialOutline />
            </div>
        </div>
    </div>)
}
export default Post;