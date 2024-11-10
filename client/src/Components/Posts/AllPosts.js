import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import UserContext from '../../Context/UserContext';
import toast, { Toaster } from 'react-hot-toast';


function AllPosts() {
    const [allTweets, setAllTweets] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [tweet, settweet] = useState('');

    async function getAllTweets() {
        const response = await axios.get(`http://localhost:6969/alltweets`);
        setAllTweets(response.data);
    }

    useEffect(() => {
        getAllTweets();
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
                setAllTweets([...allTweets, response.data]);
                settweet('');
            }),
            {
                loading: 'Posting...',
                success: 'Tweeted!',
                error: 'An error occurred',
            }
        );
    }

    const renderTweets = allTweets.map((tweet) => {
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
export default AllPosts;