import { Route, Routes } from 'react-router-dom';
import SideBar from '../SideBar';
import Posts from '../Posts';
import AccountPost from '../AccountPost/AccountPost';
import DM from '../DM';
import Tweet from '../Tweet';
import Profile from '../Profile';
import ReplyAsTweet from '../ReplyAsTweet';
import Bookmarks from '../Bookmarks';
import Quote from '../Quote';
import './Home.css';
import DMroom from '../DMroom';
import Settings from '../Settings';
import ChangePassword from '../ChangePassword';
import AccountInformation from '../AccountInformation';
import GetVerified from '../GetVerified';
import Explore from '../Explore';
import Notifications from '../Notifications';
import PostModel from '../PostModel';
import FolloowersFollowingList from '../FollowersFollowingList';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";

function Home() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [sidebarvisib, setsidebarvisib] = useState(false);

    function barsclicked() {
        setsidebarvisib(!sidebarvisib);
    }

    useEffect(() => {
        if (!user) logout();
    }, []);

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser('');
        navigate('/');
    }

    return (
        <div className='home'>

            <div className={'sidebar__home max-w-[850px]:hidden '}>
                <SideBar />
            </div>
            {/* <div className="bars" onClick={barsclicked}>
                <FaBars />
            </div> */}

            <div className='home__routes'>
                <Routes>
                    <Route path="posts/*" element={<Posts />} />
                    <Route path="DM" element={<DM />} />
                    <Route path='AccountPost' element={<AccountPost />} />
                    <Route path="tweet" element={<Tweet />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="reply" element={< ReplyAsTweet />} />
                    <Route path="bookmarks" element={< Bookmarks />} />
                    <Route path="quote" element={<Quote />} />
                    <Route path="DMroom" element={<DMroom />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="changePassword" element={<ChangePassword />} />
                    <Route path="accountInfo" element={<AccountInformation />} />
                    <Route path="getVerified" element={<GetVerified />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="notification" element={<Notifications />} />
                    <Route path="postmodel" element={<PostModel />} />
                    <Route path="list" element={<FolloowersFollowingList />} />
                </Routes>
            </div>

            <div className="border-l-[1px]  border-[#2F3336] h-[100vh] w-[25%] sticky top-0 max-w-400-width">
            </div>
        </div >
    )
}
export default Home;