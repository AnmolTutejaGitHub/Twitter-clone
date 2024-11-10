import { useContext, useEffect } from 'react';
import UserContext from '../Context/UserContext';
import Post from './Post';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function FollowingPosts() {
    const { user, setUser } = useContext(UserContext);
    const [followingTweets, setfollowingTweets] = useState([]);
    const [tweet, settweet] = useState('');


    async function getfollowingTweets() {
        const response = await axios.post(`http://localhost:6969/getFollowingTweets`, {
            username: user
        });
        setfollowingTweets(response.data);
    }

    useEffect(() => {
        getfollowingTweets();
    }, [])

    function autoResize(e) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    async function PostTheTweet() {
        toast.promise(
            axios.post('http://localhost:6969/tweet', {
                username: user,
                content: tweet
            }).then(response => {
                settweet('');
            }),
            {
                loading: 'Posting...',
                success: 'Tweeted!',
                error: 'An error occurred',
            }
        );
    }

    const renderTweets = followingTweets.map((tweet) => {
        return <Post tweet={tweet} />
    })
    return (<div>
        <div className='pt-[55px]' >
            <div className='flex items-center p-2'>
                <img src={`https://ui-avatars.com/api/?name=${user}`} className='rounded-full h-8' />
                <textarea placeholder="What is happening?!" className=" p-2 h-10 focus:outline-none bg-inherit w-full resize-none text-lg" onInput={autoResize}
                    onChange={(e) => settweet(e.target.value)} value={tweet} />
            </div>
            <div className='w-full pl-2'>
                <button className="bg-[#1C90DF] p-2 pl-8 pr-8 rounded-[50px] cursor-pointer" onClick={PostTheTweet}>Post</button>
            </div>
        </div>
        <div className='pt-2'>{renderTweets}</div>
    </div>)
}
export default FollowingPosts;