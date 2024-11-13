import { useContext } from 'react';
import UserContext from '../Context/UserContext';

function SelfProfile() {
    const { user, setUser } = useContext(UserContext);
    return (<div></div>);
}
export default SelfProfile;