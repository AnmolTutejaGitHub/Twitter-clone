import Post from './Post';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { RiGalleryFill } from "react-icons/ri";
import axios from 'axios';
import useUserStore from "../store/userStore";

function Quote() {
    const [quote, setQuote] = useState('');
    const location = useLocation();
    const tweet = location.state.tweet;
    const { username,isAuthenticated,clearUser,userid } = useUserStore();
    const token = localStorage.getItem("token");

    function autoResize(e) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    async function PostTheTweet() {
        const toastId = toast.loading('Posting...');
        let url = '';
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tweet`, {
                content: quote,
                isQuote: {
                    _bool: true,
                    parent: tweet
                }
            },{
            headers: {
                Authorization: `Bearer ${token}`
            }
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

            const incrementQuote = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/incQuote`, {
                tweet_id: tweet._id,
                retweet_id: response.data._id
            })

            fileInput.value = '';
            toast.success('Tweeted!');
        } catch (error) {
            console.error("An error occurred while posting the tweet:", error);
            toast.error('An error occurred');
        } finally {
            toast.dismiss(toastId);
        }
    }

    async function QuoteTheTweet() {
        PostTheTweet();
    }

    return (
        <div>
            <div className='p-2'>
                <p className='text-[13px] text-[#1C90DF]'>Quoting to postid @{tweet._id}</p>
                <div className='p-2'>
                    <textarea placeholder="What is happening?!" className=" p-2 h-10 focus:outline-none bg-inherit w-full resize-none text-lg" onInput={autoResize}
                        onChange={(e) => setQuote(e.target.value)} value={quote} />
                    <div className='flex items-center gap-2'>
                        <button className="bg-[#1C90DF] p-2 pl-8 pr-8 rounded-[50px] cursor-pointer" onClick={(QuoteTheTweet)}>Post</button>
                        <form encType="multipart/form-data" className="uploadform">
                            <input type="file" name="uploadfile" id="uploadfile" className='hidden' />
                            <label htmlFor="uploadfile" className='cursor-pointer'>
                                <RiGalleryFill className='text-[#1C90DF] text-[26px]' />
                            </label>
                        </form>
                    </div>
                </div>
                <Post tweet={tweet} />
            </div>
        </div>)
}
export default Quote;