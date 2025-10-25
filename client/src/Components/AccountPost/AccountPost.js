import useUserStore from "../../store/userStore";
import './AccountPost.css';
function AccountPost() {
      const { username,isAuthenticated,clearUser,userid } = useUserStore();

    return (<div>
        <div>
            <div className='user-post'>
                <p className='text-[20px]'>{username}</p>
            </div>
        </div>
    </div>)
}
export default AccountPost;