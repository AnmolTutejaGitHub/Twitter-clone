import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../Login';
import Home from '../Home/Home';
import './App.css';
import toast, { Toaster } from 'react-hot-toast';
import Signup from '../Signup';
import ForgetPassword from '../ForgetPassword';
import GetVerified from '../GetVerified';
import VerifyYourAccount from '../VerifyYourAccount';
import ResetPassword from '../ResetPassword';

function App() {
    return (
        <div className='w-[100%] h-[100vh]'>
            <Toaster position="top-center" reverseOrder={false} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home/*" element={<Home />} />
                   <Route path="/signup" element={<Signup/>}/>
                    <Route path="/verify" element={<GetVerified/>} />
                    <Route path="/verify-email/:token" element={<VerifyYourAccount/>} />
                    <Route path="/forget-password" element={<ForgetPassword/>} />
                    <Route path="/update-password/:token" element={<ResetPassword/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
export default App;