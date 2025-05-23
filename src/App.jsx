import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from './axios';

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import FriendsPage from './components/FriendsList'
import Profile from './components/Profile'
    // import Activity from './components/Activity'
import LoginPage from './components/Login'
import SignupPage from './components/Signup'
import GroupDetail from './components/GroupDetails';

function App() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        upiId: "",
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Fetch user profile to get name and email
        axios.get('/api/user', { withCredentials: true })
            .then((response) => {
                setUserData(response.data);
                setIsLoggedIn(true);
            })
            .catch(() => setIsLoggedIn(false));
    }, []);

    const handleLogout = () => {
        axios.post('/api/logout')
            .then(() => {
                setIsLoggedIn(false);
                window.location.href = "/login"; // Redirect to login page
            })
            .catch((err) => {
                console.error("Logout failed", err);
            });
    };

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Navigate to="/landing" replace />} />
                <Route path="/landing" element={<Landing userData={userData} />} />
                <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/friends" element={<FriendsPage userData={userData} />} />
                <Route path="/profile" element={<Profile userData={userData}/>} />
                {/* <Route path="/activity" element={<Activity />} /> */}
                <Route path="/logout" element={<Landing userData={userData} />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
            </Routes>
        </Router>
    )
}

export default App
