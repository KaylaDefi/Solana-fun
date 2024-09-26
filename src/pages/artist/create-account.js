"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [artistId, setArtistId] = useState(null);  // To store artist ID after account creation

  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/artist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, bio, email, password }),  
        credentials: 'include',  
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Server error:', errorMessage);
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      setArtistId(data.artist._id);  
      setSuccess('Account created successfully! You can now update your artist profile.');
    } catch (err) {
      console.error('API error:', err);
      setError('An error occurred while creating the account.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Artist Account</h1>
      <p>Log in with your wallet if you are a regular user. Only artists need to create an account.</p>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {artistId ? (
        <div>
          <p>Your artist account has been created successfully!</p>
          <button
            onClick={() => router.push(`/artist/${artistId}/edit`)}  
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Update Artist Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
            Create Account
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateAccount;
