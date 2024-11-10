import { useState } from "react";
function Profile({ user }) {
    const [tweets, setTweets] = useState([]);

    async function getUserTweets() {
        const response = await axios.post('http://localhost:6969/usertweets', {
            username: user
        })
    }
    return (<div>
        <div>{user}</div>
    </div>)
}
export default Profile;