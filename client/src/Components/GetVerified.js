import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdVerified } from "react-icons/md";
function GetVerified() {
    const { user, setUser } = useContext(UserContext);
    const [wasVerified, setWasVerified] = useState(false);

    async function isVerified() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/isVerified`, {
                username: user
            });
            if (response.status == 200) setWasVerified(true);

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        isVerified();
    }, [])


    return (<div className='h-[90vh]'>
        <div>
            {wasVerified &&
                <>
                    <div className='flex flex-col justify-center items-center'>
                        <p className='text-[22px] bold text-center pt-[20px]'>Your Account Has already been Verified</p>
                        <p className='text-[22px] bold text-center pt-[20px]'>Thanks for Supporting us</p>
                        <div className='flex justify-center'>
                            <MdVerified className='text-[100px] bold text-center pt-[20px]' />
                        </div>
                    </div>
                </>
            }
            {!wasVerified && <>
                <div className='flex flex-row justify-center items-center  pt-10 gap-3'>
                    <p className='text-[30px] text-center'>Get Verified Now</p>
                    <MdVerified className='text-[40px]' />
                </div>
                <div className='flex flex-col h-[100vh]  bold pt-[140px] p-10'>
                    <p>Pay 0.00068 <span className='text-orange-700'>BTC</span> And Get Verified for Lifetime</p>
                    <p>After Paying send us email at anmoltutejaserver@gmail.com with your TXID.</p>
                    <p>You will get Verified within 24 hours</p>
                    <p>Wallet Address : <span className='text-orange-700'>bc1q35twckgehw482526f9t3mu2462guzjxaxte2c9</span></p>
                </div>
            </>}
        </div>
    </div>)
}
export default GetVerified;