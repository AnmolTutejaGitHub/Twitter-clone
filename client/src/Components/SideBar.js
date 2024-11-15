import { MdHomeFilled } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoMail } from "react-icons/go";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { IoSettingsOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";

function SideBar() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    return (<div className="border-r-[1px]  border-[#2F3336] h-[100vh] fixed w-[25%]">
        <div className="pt-16 p-10 text-xl">
            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/posts/allposts')}>
                <MdHomeFilled className="text-2xl" />
                Home
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/explore')}>
                <IoSearch className="text-2xl" />
                Explore
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/notification')}>
                <IoNotificationsOutline className="text-2xl" />
                Notification
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/DM')}>
                <GoMail className="text-2xl" />
                Messages
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/bookmarks')} >
                <MdOutlineBookmarkBorder className="text-2xl" />
                Bookmarks
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/profile', { state: { user } })}>
                <CgProfile className="text-2xl" />
                Profile
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/settings')}>
                <IoSettingsOutline className="text-2xl" />
                Settings
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/getVerified')}>
                <MdVerified className="text-2xl" />
                Get Verified
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3">
                <div className="bg-[#1C90DF] p-3 pl-16 pr-16 rounded-[50px] cursor-pointer" onClick={() => navigate('/home/postmodel')}>Post</div>
            </div>
        </div>
    </div>)
}
export default SideBar;