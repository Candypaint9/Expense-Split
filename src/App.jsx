import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios';

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import FriendsPage from './components/FriendsList'
import Profile from './components/Profile'
import Activity from './components/Activity'
import LoginPage from './components/Login'
import SignupPage from './components/Signup'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      // Call backend to check auth
      axios.get('http://localhost:5000/api/check-auth', {
        withCredentials: true // send cookie
      })
        .then(() => setIsLoggedIn(true))
        .catch(() => setIsLoggedIn(false));
    }, []);
    return (
        <Router>
            {/* Pass isLoggedIn dynamically later */}
            <Navbar isLoggedIn={isLoggedIn} />

            <Routes>
                <Route path="/" element={<Navigate to="/landing" replace />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/logout" element={<Landing />} />
            </Routes>
        </Router>
    )
}

export default App