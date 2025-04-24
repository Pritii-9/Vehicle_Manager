import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api.js';
// import { AuthContext } from '../AuthContext'; // If you're using Context API for auth state
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { login } = useContext(AuthContext); // If using Context API
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier,
        password,
      });

      // On successful login, the backend should send back a JWT
      const token = response.data.token;

      if (token) {
        // Store the JWT in local storage (or a cookie)
        localStorage.setItem('authToken', token);

        // Optionally, decode the token to get user information and update your auth state
        // const decodedToken = JSON.parse(atob(token.split('.')[1]));
        // login(decodedToken); // If using Context API

        // Redirect the user to the main application page
        navigate('/');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Log In</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
              Username or Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="identifier"
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log In
            </button>
            <a className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800" href="/signup">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;