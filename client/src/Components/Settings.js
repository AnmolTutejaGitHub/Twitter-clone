import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { IoPersonOutline } from "react-icons/io5";
import { FaKey } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/actions/userActions';

function Settings() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // function logout() {
    //     localStorage.removeItem('token');
    //     setUser('');
    //     navigate('/');
    // }

    function logout() {
        localStorage.removeItem('token');
        dispatch(clearUser());
        sessionStorage.removeItem('user');
        navigate('/');
    }

    return (<div className='p-4'>
        <div className='font-bold text-[20px] pb-6'>Your Account</div>
        <div className='text-[#71767A] text-[14px] pb-2'>See information about your account, download an archive of your data, or learn about your account deactivation options
        </div>

        <div>
            <div className='flex gap-4 items-center hover:bg-[#16181C] p-2'>
                <div className='text-[18px] font-bold text-[#71767A]'><IoPersonOutline /></div>
                <div onClick={() => navigate('/home/accountInfo')}>
                    <div>Account information</div>
                    <div className='text-[#71767A] text-[14px]'>See Your Account Information like Email Address</div>
                </div>
            </div>

            <div className='flex gap-4 items-center hover:bg-[#16181C] p-2'>
                <div className='text-[18px] font-bold text-[#71767A]'><FaKey /></div>
                <div onClick={() => navigate('/home/changePassword')}>
                    <div >Change Your Password</div>
                    <div className='text-[#71767A] text-[14px]'>Change Your password At any time</div>
                </div>
            </div>

            <div className='flex gap-4 items-center hover:bg-[#16181C] p-2'>
                <div className='text-[18px] font-bold text-[#71767A]'><AiOutlineLogout /></div>
                <div onClick={logout}>
                    <div >Logout</div>
                    <div className='text-[#71767A] text-[14px]' >Logout from your Account</div>
                </div>
            </div>


        </div>
    </div >);
}
export default Settings;