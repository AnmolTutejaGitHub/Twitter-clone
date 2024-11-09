import { useState } from "react";
import Post from "./Post/Post";
import axios from 'axios';

function Tweet({ tweet }) {
    const [replies, setreplies] = useState([]);

    async function getReplies() {
        const response = await axios.post('http://localhost:6969/')
    }
    return (<div>
        <Post tweet={tweet} />
    </div>)
}
export default Tweet;