"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Redirect the user to their profile page after successful login
      router.push(`/artist/${data.artistId}`);
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
