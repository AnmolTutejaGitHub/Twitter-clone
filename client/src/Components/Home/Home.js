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

function Home() {
    return (
        <div className='home'>

            <div className='sidebar__home'>
                <SideBar />
            </div>

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

            <div className="border-l-[1px]  border-[#2F3336] h-[100vh] w-[25%] sticky top-0">
            </div>
        </div>
    )
}
export default Home;