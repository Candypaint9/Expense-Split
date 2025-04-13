import React from 'react'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import FriendsPage from './components/FriendsList';
import Profile from './components/Profile';
import Activity from './components/Activity';
import LoginPage from './components/Login';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
    return (
        <Router>
            <Navbar isLoggedIn={true}/>     {/* change this later on*/}
            <Routes>
                <Route path="/" element={<Landing/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/friends" element={<FriendsPage/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/activity" element={<Activity/>} />
                <Route path="/logout" element={<Landing/>} />
            </Routes>
        </Router>
    )
}

export default App