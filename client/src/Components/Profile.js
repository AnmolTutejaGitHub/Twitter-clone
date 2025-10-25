import { useState } from "react";
import axios from 'axios';
import Post from '../Components/Post';
import { useEffect } from "react";
import ReplyAsPost from "./ReplyAsPost";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import { ColorRing } from 'react-loader-spinner';
import useUserStore from "../store/userStore";

function Profile() {
    const location = useLocation();
    const user_ = location.state.user;
    const [tweets, setTweets] = useState([]);
    const [showreplies, setShowreplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const { username,isAuthenticated,clearUser,userid } = useUserStore();
    const [Following, setFollowing] = useState(false);
    const [followersList, setfollowersList] = useState([]);
    const [followingList, setfollowingList] = useState([]);
    const [verified, setVerified] = useState(false);
    const [loading, setloading] = useState(true);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    async function getUserTweets() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/usertweets`, {
            username: user_
        })
        setTweets(response.data);
        setloading(false);
    }

    async function getUserReplies() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/userReplies`, {
            username: user_
        })
        setReplies(response.data);
        setloading(false);
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
        const response = axios.post(`${process.env.REACT_APP_BACKEND_URL}/followAccount`, {
            creator: user_
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setFollowing(true);
        window.location.reload();
    }

    async function unfollowHim() {
        const response = axios.post(`${process.env.REACT_APP_BACKEND_URL}/unfollowAccount`, {
            creator: user_
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setFollowing(false);
        window.location.reload();
    }

    async function isFollowing() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/isFollowed`, {
                creator: user_
            },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            if (response.status == 200) setFollowing(true);
        } catch (e) { }
    }

    async function getFollowersFollowing() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getFollowersFollowing`, {
                username: user_,
            })
            setfollowersList(response.data.followers);
            setfollowingList(response.data.following);
        } catch (e) { }
    }

    async function isVerified() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/isVerified`, {
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
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/list`, {
            username: user_,
            followers: true
        })
        navigate('/home/list', { state: { usersList: response.data } });
    }

    async function displayfollowings() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/list`, {
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
                    {!Following && username != user_ && <button onClick={followHim}>Follow</button>}
                    {Following && username != user_ && <button onClick={unfollowHim}>Following</button>}
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
            <>  {!loading && tweets.length == 0 && <p className="text-[24px] text-center pt-10">User has not tweeted anything</p>}
                <div>{renderTweets}</div>
            </>
        }
        {showreplies && <>  {replies.length == 0 && <p className="text-[24px] text-center pt-10">User has not replied anything</p>}
            <div>{renderReplies}</div>
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

    </div>)
}
export default Profile;