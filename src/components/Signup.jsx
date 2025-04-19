import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    // TODO: call your signup API here…
    // on success:
    navigate('/login')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Sign Up</h2>

        <label className="block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

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
          Create Account
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignupPage
