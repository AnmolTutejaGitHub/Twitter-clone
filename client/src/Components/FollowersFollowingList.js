import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function FolloowersFollowingList() {
    const location = useLocation();
    const usersList = location.state.usersList;
    const navigate = useNavigate();
    const renderList = usersList.map((_user) => {
        return <div className="flex gap-4 items-center hover:bg-[#16181C] p-3" onClick={() => navigate('/home/profile', { state: { user: _user } })}>
            <img src={`https://ui-avatars.com/api/?name=${_user}`} className="rounded-full h-[40px]" />
            <p>{_user}</p>
        </div >

    })
    return (<div className="flex flex-col p-4">{renderList}</div>)
}
export default FolloowersFollowingList;