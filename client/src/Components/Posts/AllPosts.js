import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import axios from 'axios';

function AllPosts() {
    const [allTweets, setAllTweets] = useState([]);

    async function getAllTweets() {
        const response = await axios.get(`http://localhost:6969/alltweets`);
        setAllTweets(response.data);
    }

    useEffect(() => {
        getAllTweets();
    }, [])

    const renderTweets = allTweets.map((tweet) => {
        return <Post tweet={tweet} />
    })
    return (<div>{renderTweets}</div>)
}
export default AllPosts;