import Post from './Post';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import { RiGalleryFill } from "react-icons/ri";
import { ColorRing } from 'react-loader-spinner';


function AllPosts() {
    const [allTweets, setAllTweets] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [tweet, settweet] = useState('');
    const [loading, setloading] = useState(true);

    async function getAllTweets() {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/alltweets`);
        setAllTweets(response.data);
        setloading(false);
    }

    useEffect(() => {
        getAllTweets();
    }, [])

    function autoResize(e) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    async function PostTheTweet() {
        const toastId = toast.loading('Posting...');
        let url = '';
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tweet`, {
                username: user,
                content: tweet
            });

            const fileInput = document.getElementById('uploadfile');
            const file = fileInput.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('uploadfile', file);
                formData.append('tweet_id', response.data._id);

                try {
                    const uploadResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fileupload`, {
                        method: 'POST',
                        body: formData
                    });

                    const data = await uploadResponse.json();
                    url = data.url;

                } catch (error) {
                    console.error("Error during file upload:", error);
                }
            }
            const newTweeet = response.data;
            if (url) newTweeet.fileURL = url;
            setAllTweets([newTweeet, ...allTweets,]);
            settweet('');
            fileInput.value = '';
            toast.success('Tweeted!');
        } catch (error) {
            console.error("An error occurred while posting the tweet:", error);
            toast.error('An error occurred');
        } finally {
            toast.dismiss(toastId);
        }
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
            <div className='w-full pl-2 flex gap-4 items-center'>
                <button className="bg-[#1C90DF] p-2 pl-8 pr-8 rounded-[50px] cursor-pointer" onClick={PostTheTweet}>Post</button>
                <form encType="multipart/form-data" className="uploadform">
                    <input type="file" name="uploadfile" id="uploadfile" className='hidden' />
                    <label htmlFor="uploadfile" className='cursor-pointer'>
                        <RiGalleryFill className='text-[#1C90DF] text-[26px]' />
                    </label>
                </form>
            </div>
        </div>
        <div className='pt-2'>{renderTweets}</div>
        {loading && <div className='flex justify-center items-center h-[60vh]'><ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#1C90DF', '#1C90DF', '#1C90DF', '#1C90DF', '#1C90DF']}
        /></div>}
    </div>)
}
export default AllPosts;