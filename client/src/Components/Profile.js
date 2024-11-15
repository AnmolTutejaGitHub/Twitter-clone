import { useState } from "react";
import axios from 'axios';
import Post from '../Components/Post';
import { useEffect } from "react";
import ReplyAsPost from "./ReplyAsPost";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdVerified } from "react-icons/md";

function Profile() {
    const location = useLocation();
    const user_ = location.state.user;
    const [tweets, setTweets] = useState([]);
    const [showreplies, setShowreplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [Following, setFollowing] = useState(false);
    const [followersList, setfollowersList] = useState([]);
    const [followingList, setfollowingList] = useState([]);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    async function getUserTweets() {
        const response = await axios.post('http://localhost:6969/usertweets', {
            username: user_
        })
        setTweets(response.data);
    }

    async function getUserReplies() {
        const response = await axios.post('http://localhost:6969/userReplies', {
            username: user_
        })
        setReplies(response.data);
    }

    useEffect(() => {
        getUserTweets();
        getUserReplies();
    }, [])

    const renderTweets = tweets.map((tweet) => {
        return <Post tweet={tweet} />
    })

    const renderReplies = replies.map((reply) => {
        return <ReplyAsPost reply={reply} />
    })

    async function followHim() {
        const response = axios.post('http://localhost:6969/followAccount', {
            username: user,
            creator: user_
        })
        setFollowing(true);
        window.location.reload();
    }

    async function unfollowHim() {
        const response = axios.post('http://localhost:6969/unfollowAccount', {
            username: user,
            creator: user_
        })
        setFollowing(false);
        window.location.reload();
    }

    async function isFollowing() {
        try {
            const response = await axios.post('http://localhost:6969/isFollowed', {
                username: user,
                creator: user_
            })
            if (response.status == 200) setFollowing(true);
        } catch (e) { }
    }

    async function getFollowersFollowing() {
        try {
            const response = await axios.post('http://localhost:6969/getFollowersFollowing', {
                username: user_,
            })
            setfollowersList(response.data.followers);
            setfollowingList(response.data.following);
        } catch (e) { }
    }

    async function isVerified() {
        try {
            const response = await axios.post('http://localhost:6969/isVerified', {
                username: user_
            });
            console.log(response);
            if (response.status == 200) setVerified(true);

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        isFollowing();
        isVerified();
    }, [])

    useEffect(() => {
        getFollowersFollowing();
    }, [Following])

    async function displayfollowers() {
        const response = await axios.post(`http://localhost:6969/list`, {
            username: user_,
            followers: true
        })
        navigate('/home/list', { state: { usersList: response.data } });
    }

    async function displayfollowings() {
        const response = await axios.post(`http://localhost:6969/list`, {
            username: user_,
            following: true
        })
        navigate('/home/list', { state: { usersList: response.data } });
    }

    return (<div>
        <div>
            <div className=" p-3 fixed ">
                <div className="flex gap-10 align-center">
                    <IoMdArrowRoundBack onClick={() => window.history.back()} />
                    <div className="flex items-center gap-2 justify-center">
                        <img src={`https://ui-avatars.com/api/?name=${user_}`} className="rounded-full h-[30px]" />
                        <div>{user_}</div>
                        {verified && <MdVerified />}
                    </div>
                    {!Following && user != user_ && <button onClick={followHim}>Follow</button>}
                    {Following && user != user_ && <button onClick={unfollowHim}>Following</button>}
                    <div onClick={displayfollowers}>{followersList.length} followers</div>
                    <div onClick={displayfollowings}>{followingList.length} following</div>
                </div>
            </div>
            <div className="pt-14 "></div>
            <div className="flex p-2 justify-around border-[1px] border-[#2F3336] font-bold">
                <div onClick={() => setShowreplies(false)} className={`pb-1 ${!showreplies ? "border-b-4 border-b-blue-500" : ""}`}>Posts</div>
                <div onClick={() => setShowreplies(true)} className={`pb-1 ${showreplies ? "border-b-4 border-b-blue-500" : ""}`}>Replies</div>
            </div>
        </div>
        {!showreplies &&
            <>  {tweets.length == 0 && <p className="text-[24px] text-center pt-10">User has not tweeted anything</p>}
                <div>{renderTweets}</div>
            </>
        }
        {showreplies && <>  {replies.length == 0 && <p className="text-[24px] text-center pt-10">User has not replied anything</p>}
            <div>{renderReplies}</div>
        </>}
    </div>)
}
export default Profile;