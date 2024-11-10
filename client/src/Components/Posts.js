import { Route, Routes } from 'react-router-dom';
import AllPosts from './AllPosts';
import FollowingPosts from './FollowingPosts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import axios from 'axios';

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

    return <div>
        <div className='flex justify-around fixed w-[50%] text-lg bg-[rgba( 255, 255, 255, 0.2 )] p-3 '>
            <div onClick={() => { navigate('allposts'); setCurr('all') }} className={curr == 'all' ? activeClass : ''}>All Posts</div>
            <div onClick={() => { navigate('followingposts'); setCurr('following') }} className={curr == 'following' ? activeClass : ''}>Following</div>
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