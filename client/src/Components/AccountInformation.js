import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import { useState, useEffect } from 'react';

function AccountInformation() {
    const { user, setUser } = useContext(UserContext);
    const [userObj, setUserObj] = useState({});

    async function getUser() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getUser`, {
            username: user
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
                <div className='text-[#71767A] text-[14px]'>@{user}</div>
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