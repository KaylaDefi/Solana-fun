"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react'; 
import { useRouter } from 'next/navigation'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    console.log("Attempting to log in with:", email, password); 
  
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
  
    console.log("SignIn Response:", res); 
    
    if (res.ok) {
      router.push('/artist/dashboard');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
