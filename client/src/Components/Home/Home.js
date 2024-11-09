import { Route, Routes } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import Posts from '../Posts';
import AccountPost from '../AccountPost/AccountPost';
import DM from '../DM/DM';
import './Home.css';

function Home() {
    return (
        <div className='home'>

            <div className='sidebar__home'>
                <SideBar />
            </div>

            <div className='home__routes'>
                <Routes>
                    <Route path="posts/*" element={<Posts />} />
                    <Route path="DM" element={<DM />} />
                    <Route path='AccountPost' element={<AccountPost />} />
                </Routes>
            </div>

            <div className='home__disccover'>
            </div>
        </div>
    )
}
export default Home;