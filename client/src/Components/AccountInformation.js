import { IoIosArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import { useState, useEffect } from 'react';
import useUserStore from "../store/userStore";

function AccountInformation() {
   const { username,isAuthenticated,clearUser,userid } = useUserStore();
    const [userObj, setUserObj] = useState({});
   const token = localStorage.getItem("token");

    async function getUser() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getUser`,{
            username  : username
    });
        setUserObj(response.data);
    }

    useEffect(() => {
        getUser();
    }, [])
    return (<div className='flex gap-2 flex-col'>
        <div className='font-bold text-[20px] flex gap-2 items-center'>
            <IoIosArrowRoundBack className='text-[40px]' onClick={() => window.history.back()} />
            <div>Account Information</div>
        </div>

        <div className=''>
            <div className=' hover:bg-[#16181C] p-2 pl-4'>
                <div>Username</div>
                <div className='text-[#71767A] text-[14px]'>@{username}</div>
            </div>
            <div className=' hover:bg-[#16181C] p-2 pl-4'>
                <div>Email</div>
                <div className='text-[#71767A] text-[14px]'>{userObj?.email}</div>
            </div>
            <div className=' hover:bg-[#16181C] p-2 pl-4'>
                <div>Created At</div>
                <div className='text-[#71767A] text-[14px]'>{userObj?.JoinedDate}</div>
            </div>

            <div className=' hover:bg-[#16181C] p-2 pl-4'>
                <div>Verified</div>
                <div className='text-[#71767A] text-[14px]'>Status : {userObj.isVerified ? "true" : "false"}</div>
            </div>

        </div>
    </div>)
}
export default AccountInformation;