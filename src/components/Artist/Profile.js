"use client";

import { useState } from 'react';

const Profile = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to create/update artist profile
    console.log('Profile updated:', { name, bio, socialLinks });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biography</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700">Social Links</label>
        <input
          type="text"
          id="socialLinks"
          value={socialLinks}
          onChange={(e) => setSocialLinks(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Update Profile</button>
    </form>
  );
};

export default Profile;
