import { MdHomeFilled } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoMail } from "react-icons/go";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

function SideBar() {
    const navigate = useNavigate();
    return (<div className="border-r-[1px]  border-[#2F3336] h-[100vh] fixed w-[25%]">
        <div className="pt-16 p-10 text-xl">
            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/posts/allposts')}>
                <MdHomeFilled className="text-2xl" />
                Home
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer">
                <IoSearch className="text-2xl" />
                Explore
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer">
                <IoNotificationsOutline className="text-2xl" />
                Notification
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer">
                <GoMail className="text-2xl" />
                Messages
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer" onClick={() => navigate('/home/bookmarks')} >
                <MdOutlineBookmarkBorder className="text-2xl" />
                Bookmarks
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3 hover:bg-[#181818] cursor-pointer">
                <CgProfile className="text-2xl" />
                Profile
            </div>

            <div className="flex items-center pl-10 pt-5 pb-5 gap-3">
                <div className="bg-[#1C90DF] p-3 pl-16 pr-16 rounded-[50px] cursor-pointer">Post</div>
            </div>
        </div>
    </div>)
}
export default SideBar;