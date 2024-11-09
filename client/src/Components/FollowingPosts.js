import { useContext, useEffect } from 'react';
import UserContext from '../Context/UserContext';
import Post from './Post/Post';
import { useState } from 'react';
import axios from 'axios';

function FollowingPosts() {
    const { user, setUser } = useContext(UserContext);
    const [followingTweets, setfollowingTweets] = useState([]);


    async function getfollowingTweets() {
        const response = await axios.post(`http://localhost:6969/getFollowingTweets`, {
            username: user
        });
        setfollowingTweets(response.data);
    }

    useEffect(() => {
        getfollowingTweets();
    }, [])

    const renderTweets = followingTweets.map((tweet) => {
        return <Post tweet={tweet} />
    })
    return (<div>{renderTweets}</div>)
}
export default FollowingPosts;