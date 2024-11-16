import axios from 'axios';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

function Bookmarks() {
    const [bookmarks_id, setBookmarks_id] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    async function getBookmarks() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getBookmarks`, {
                username: user
            });
            setBookmarks_id(response.data);
            console.log(response.data);
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
    return (<div className='flex flex-col text-center pt-16'>{renderBookmarks}</div>);
}
export default Bookmarks;