import { useContext, useState, useEffect } from 'react';
import UserContext from '../Context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Blocks } from 'react-loader-spinner'
import { RiTwitterXFill } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { setUser } from './../redux/actions/userActions';

function Login() {
    const [EnteredUser, setEnteredUser] = useState('');
    const [EnteredEmail, setEnteredEmail] = useState('');
    const [EnteredPassword, setEnteredPassword] = useState('');
    const [Error, setError] = useState('');
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) navigate('/home/posts/allposts');
    }, [user])

    async function handleLogin() {
        try {
            console.log(`${process.env.REACT_APP_BACKEND_URL}`);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                name: EnteredUser,
                email: EnteredEmail,
                password: EnteredPassword,
            });

            if (response.status === 200) {
                const token = response.data.token;
                const EnteredUser = response.data.user;
                localStorage.setItem('token', token);
                sessionStorage.setItem('user', EnteredUser);
                dispatch(setUser(EnteredUser));
                navigate('/OTPValidation', { state: { email: EnteredEmail } });
            }
        } catch (error) {
            setError(error?.response?.data?.error || "Some error Occurred");
        }
    }


    return (
        <div className="flex justify-center items-center">
            {loading &&
                <div className="flex justify-center items-center h-[100v] w-full">
                    <Blocks
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        visible={true}
                    />
                </div>
            }


            {!loading &&
                <div className='mt-[12%] w-[400px]'>
                    <form className='p-[2rem] rounded-[5px] flex gap-[1rem] flex-col' onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className='flex items-center gap-2 pl-2'> <p className='text-[35px] font-bold'>Sign in to</p><RiTwitterXFill className='text-[35px] font-bold' /></div>
                        <input placeholder="Enter Username" onChange={(e) => { setEnteredUser(e.target.value) }} className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#1C9BEF] placeholder:text-[#71767A]' required></input>
                        <input placeholder="Enter Email" onChange={(e) => { setEnteredEmail(e.target.value) }} className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#1C9BEF] placeholder:text-[#71767A]' required></input>
                        <input placeholder="Enter Password" onChange={(e) => { setEnteredPassword(e.target.value) }} className='p-[0.6rem] outline-none w-full bg-inherit border-[1.7px] border-[#333639] focus:border-[#1C9BEF] placeholder:text-[#71767A]' required></input>
                        <div><Link to="/forgetpassword" className='text-[#1C9BEF]'>Forget Password?</Link></div>
                        <p>Don't have an Account ? <span><Link to="/signup" className='text-[#1C9BEF]'>Signup</Link></span></p>
                        <button type="submit" className='p-2 bg-sky-600 rounded-sm'>Login</button>
                        {Error && <p className='text-red-600'>*{Error}</p>}
                    </form>
                </div>}
        </div>);
}
export default Login; 