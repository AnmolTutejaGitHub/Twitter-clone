import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import './AccountPost.css';
function AccountPost() {
    const { user, setUser } = useContext(UserContext);
    return (<div>
        <div>
            <div className='user-post'>
                <p className='text-[20px]'>{user}</p>
            </div>
        </div>
    </div>)
}
export default AccountPost;