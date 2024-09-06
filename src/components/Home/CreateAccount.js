"use client"; // Next.js directive for client-side components

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for handling redirects

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const [password, setPassword] = useState(''); // Add password state
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [artistId, setArtistId] = useState(null); // Store artist ID after creation

  const router = useRouter(); // For redirection if needed

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profilePicture) {
      setError('Please upload a profile picture.');
      return;
    }

    // Create form data to send including the image file and additional fields
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('email', email); // Add email to formData
    formData.append('password', password); // Add password to formData
    formData.append('profilePicture', profilePicture);

    try {
      const response = await fetch('http://localhost:5001/api/create-account', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      setSuccess('Account created successfully!');
      setError('');
      setArtistId(data.artist._id); // Save the artist ID

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

      {/* If artistId exists, show the "Update Profile" button */}
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Profile Picture Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
            Create Account
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateAccount;
