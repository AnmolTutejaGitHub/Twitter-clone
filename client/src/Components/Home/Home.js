import { Route, Routes } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import Posts from '../Posts/Posts';
import DM from '../DM/DM';

function Home() {
    return (
        <div>
            <SideBar />
            <div>
                <Routes>
                    <Route path="posts" element={<Posts />} />
                    <Route path="DM" element={<DM />} />
                </Routes>
            </div>
        </div>
    )
}
export default Home;