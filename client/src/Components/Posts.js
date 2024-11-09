import { Route, Routes } from 'react-router-dom';
import AllPosts from './Posts/AllPosts';
import FollowingPosts from './FollowingPosts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';

function Posts() {
    const [curr, setCurr] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (location.pathname.includes('allposts')) {
            setCurr('all');
        } else if (location.pathname.includes('followingposts')) {
            setCurr('following');
        }
    }, [location.pathname]);

    const activeClass = 'border-b-4 border-blue-500';

    function autoResize(e) {
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    return <div>
        <div className='flex justify-around fixed w-[50%] text-lg bg-[rgba( 255, 255, 255, 0.2 )] p-3 '>
            <div onClick={() => { navigate('allposts'); setCurr('all') }} className={curr == 'all' ? activeClass : ''}>All Posts</div>
            <div onClick={() => { navigate('followingposts'); setCurr('following') }} className={curr == 'following' ? activeClass : ''}>Following</div>
        </div>

        <div className='pt-[55px]'>
            <div className='flex items-center p-2'>
                <img src={`https://ui-avatars.com/api/?name=${user}`} className='rounded-full h-8' />
                <textarea placeholder="What is happening?!" className=" p-2 h-10 focus:outline-none bg-inherit w-full resize-none text-lg" onInput={autoResize} />
            </div>
            <div className='w-full pl-2'>
                <button className="bg-[#1C90DF] p-2 pl-8 pr-8 rounded-[50px] cursor-pointer">Post</button>
            </div>
        </div>

        <div className='pt-[5px]'>
            <Routes>
                <Route path="AllPosts" element={<AllPosts />} />
                <Route path="followingPosts" element={<FollowingPosts />} />
            </Routes>
        </div>
    </div >
}
export default Posts;