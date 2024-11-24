import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Post from './Post';
import ReplyAsPost from './ReplyAsPost';
import { useEffect } from 'react';
import { ColorRing } from 'react-loader-spinner';

function Explore() {
    const [searchTerm, setSerchTerm] = useState('');
    const [searchedTweets, setSearchedTweets] = useState([]);
    const [searchedReplies, setSearchedReplies] = useState([]);
    const [searchedusers, setSearchedUser] = useState([]);
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    async function Search() {
        try {
            setloading(true);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/explore`, {
                searchTerm: searchTerm
            })
            if (response.status == 200) {
                setSearchedTweets(response.data.tweets);
                setSearchedReplies(response.data.replies);
                setSearchedUser(response.data.users);
            }
        } catch (e) { } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchedReplies([]);
            setSearchedTweets([]);
            setSearchedUser([]);
        } else Search();
    }, [searchTerm])

    const renderUsers = searchedusers.map((usr) => {
        return <div onClick={() => navigate('/home/profile', { state: { user: usr.name } })}>{usr._id}</div>
    })

    const renderTweets = searchedTweets.map((tweet) => {
        return <Post tweet={tweet} />
    })

    const renderReplies = searchedReplies.map((reply) => {
        return <ReplyAsPost reply={reply} />
    })


    return (<div>
        <div className="flex justify-center pt-2">
            <input placeholder="Search" className="p-2 w-[90%] bg-[#202327] outline-none rounded-[8px] placeholder:text-[#757575]"
                onChange={(e) => { setSerchTerm(e.target.value); }} value={searchTerm}></input>
        </div>
        {searchTerm &&
            <>
                <div className='text-[#1C90DF] cursor-pointer flex flex-col justify-center items-center'>{renderUsers}</div>
                <div>{renderTweets}</div>
                <div>{renderReplies}</div>
            </>
        }
        {!searchTerm &&
            <>
                <div className='flex justify-center pt-16'>
                    <p className='text-[24px]'>What would you like to Search ?</p>
                </div>
            </>
        }

        {!loading && searchTerm && searchedusers.length == 0 && searchedReplies.length == 0 && searchedTweets.length == 0
            && <>
                <div className='flex justify-center pt-16'>
                    <p className='text-[24px]'>No Result Found</p>
                </div>
            </>}

        {loading && <div className='flex justify-center items-center h-[60vh]'><ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#1C90DF', '#1C90DF', '#1C90DF', '#1C90DF', '#1C90DF']}
        /></div>}
    </div>
    )
}
export default Explore;