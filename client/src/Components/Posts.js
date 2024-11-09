import { Route, Routes } from 'react-router-dom';
import AllPosts from './Posts/AllPosts';
import FollowingPosts from './FollowingPosts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Posts() {
    const [curr, setCurr] = useState('all');
    const navigate = useNavigate();

    const activeClass = 'border-b-4 border-blue-500';

    return <div>
        <div className='flex justify-around fixed w-[50%] text-lg bg-[rgba( 255, 255, 255, 0.2 )] p-3 '>
            <div onClick={() => { navigate('allposts'); setCurr('all') }} className={curr == 'all' ? activeClass : ''}>All Posts</div>
            <div onClick={() => { navigate('followingposts'); setCurr('following') }} className={curr == 'following' ? activeClass : ''}>Following</div>
        </div>

        <div className='pt-[55px]'>
            <Routes>
                <Route path="AllPosts" element={<AllPosts />} />
                <Route path="followingPosts" element={<FollowingPosts />} />
            </Routes>
        </div>
    </div >
}
export default Posts;