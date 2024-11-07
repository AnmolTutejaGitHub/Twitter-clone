import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../Login/Login';
import Home from '../Home/Home';
import './App.css';

function App() {
    return (
        <div>
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