import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async e => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/login', {
                email,
                password
            });

            console.log("Login success:", res.data.message);
            alert("Login successful!");
            navigate('/dashboard'); // or wherever
        } catch (err) {
            if (err.response) {
                console.error("Login error:", err.response.data.message || err.response.data.error);
                alert(err.response.data.message || "Login failed");
            } else {
                console.error("Network/server error:", err.message);
                alert("Error connecting to server");
            }
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-semibold mb-4 text-green-600">Log In</h2>

                <label className="block mb-2 text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                <label className="block mb-2 text-gray-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                <button
                    type="submit"
                    className="w-full py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
                >
                    Log In
                </button>

                <p className="mt-4 text-center text-gray-600">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-green-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default LoginPage
