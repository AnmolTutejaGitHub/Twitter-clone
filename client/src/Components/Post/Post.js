import { FaRegComment } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";

function Post({ tweet }) {

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
            <FaRegComment />
            <FaRetweet />
            <FaRegHeart />
            <CiBookmark />
            <IoShareSocialOutline />
        </div>
    </div>)
}
export default Post;