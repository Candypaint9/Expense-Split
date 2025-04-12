import React from 'react'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import FriendsPage from './components/FriendsList';
import Profile from './components/Profile';
import Activity from './components/Activity';
import LogoutPage from './components/Logout';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Landing/>} />
                <Route path="/friends" element={<FriendsPage/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/activity" element={<Activity/>} />
                <Route path="/logout" element={<LogoutPage/>} />
            </Routes>
        </Router>
    )
}

export default App