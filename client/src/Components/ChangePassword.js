import { useContext, useState } from 'react';
import UserContext from '../Context/UserContext';
import { IoIosArrowRoundBack } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function ChangePassword() {
    const { user, setUser } = useContext(UserContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const notify = (text) => toast.success(text);
    const notifyErr = (text) => toast.error(text);

    async function changePassword() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changepassword`, {
                username: user,
                newPassword,
                oldPassword
            })
            if (response.status === 200) notify("password changed successfully");
            else notify("Wrong Credentials");
        } catch (e) {
            notifyErr(e?.response?.data?.message || e.response.data || e?.message || 'some error occurred');
            console.log(e);
        }
    }

    return (<div className='p-2 flex flex-col gap-4'>
        <ToastContainer />
        <div className='flex items-center gap-2'>
            <IoIosArrowRoundBack className='text-[40px]' onClick={() => window.history.back()} />
            <div className='font-bold text-[20px]'>Change Password</div>
        </div>
        <div>
            <input placeholder="Current Password" className='bg-inherit outline-none border-2 border-[#2F3336] focus:border-[#1C9BEF] p-2 w-full'
                onChange={(e) => setOldPassword(e.target.value)} value={oldPassword}></input>
            <p className='text-[#1D92E1] text-[14px] pl-2 hover:underline'>frogot password?</p>
        </div>
        <input placeholder="New Password" className='bg-inherit outline-none border-2 border-[#2F3336] focus:border-[#1C9BEF] p-2 w-full'
            onChange={(e) => setNewPassword(e.target.value)} value={newPassword}></input>
        <button className='bg-[#1D92E1] w-[70px] p-2 rounded-[20px]' onClick={changePassword} >save</button>
    </div>)
}
export default ChangePassword;