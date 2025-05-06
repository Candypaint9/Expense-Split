import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import FriendsPage from './components/FriendsList'
import Profile from './components/Profile'
import Activity from './components/Activity'
import LoginPage from './components/Login'
import SignupPage from './components/Signup'        

function App() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    upiId: "",
    qrCode: null,
    balance: {
      totalOwed: 0,
      totalOwe: 0
    }
  });

  return (
    <Router>
      <Navbar isLoggedIn={false} />
      <Routes>
        <Route path="/" element={<Landing userData={userData} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />  
        <Route path="/friends" element={<FriendsPage userData={userData} />} />
        <Route path="/profile" element={<Profile userData={userData} setUserData={setUserData} />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/logout" element={<Landing userData={userData} />} />
      </Routes>
    </Router>
  )
}

export default App
