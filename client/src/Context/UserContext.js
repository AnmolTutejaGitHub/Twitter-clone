import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/actions/userActions';

const UserContext = createContext();

function Provider({ children }) {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);

    async function decodeToken() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verifytokenAndGetUsername`, {
                    token: token
                });
                if (response.status === 200) {
                    const userData = response.data.user;
                    dispatch(setUser(userData));
                    sessionStorage.setItem('user', userData);
                    console.log("set by token", sessionStorage.getItem('user'));
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        decodeToken();
    }, []);

    useEffect(() => {
        if (user !== null) {
            sessionStorage.setItem('user', user);
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export { Provider };
export default UserContext;