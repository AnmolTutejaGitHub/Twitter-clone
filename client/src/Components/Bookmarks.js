import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import useUserStore from "../store/userStore";

function Bookmarks() {
    const [bookmarks_id, setBookmarks_id] = useState([]);
    const { username,isAuthenticated,clearUser,userid } = useUserStore();
    const navigate = useNavigate();
    const [loading, setloading] = useState(true);
    const token = localStorage.getItem("token");
    async function getBookmarks() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getBookmarks`,{
            headers: {
                Authorization: `Bearer ${token}`
            }});
            setBookmarks_id(response.data);
            console.log(response.data);
            setloading(false);
        } catch (e) { }
    }

    useEffect(() => {
        getBookmarks();
    }, [])

    async function navigateToPost(id) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/findTweetorReplyById`, {
                id: id
            })
            if (response.status == 200) {
                if (response.data.type == 'tweet') navigate('/home/tweet', { state: { tweet: response.data.tweet } });
                if (response.data.type == 'reply') navigate('/home/reply', { state: { reply: response.data.reply } });
            }
        } catch (e) { }
    }

    const renderBookmarks = bookmarks_id.map((id) => {
        return <p className='text-blue-500 cursor-pointer' onClick={() => navigateToPost(id)}>{id}</p>
    })
    return (
        <div>
            <div className='flex flex-col text-center pt-16'>{renderBookmarks}</div>
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

    );
}
export default Bookmarks;