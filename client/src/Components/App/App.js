import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../Login';
import Home from '../Home/Home';
import './App.css';
import toast, { Toaster } from 'react-hot-toast';

function App() {
    return (
        <div className='w-[100%] h-[100vh]'>
            <Toaster position="top-center" reverseOrder={false} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home/*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
export default App;