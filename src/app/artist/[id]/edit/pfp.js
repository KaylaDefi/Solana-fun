"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ChangePfp = ({ params }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const artistId = params.id; // Get artist ID from URL params

  const handlePfpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!profilePicture) {
      setError('Please select a profile picture to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const response = await fetch(`/api/artist/${artistId}/pfp-route`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Profile picture updated successfully!');
        router.push('/dashboard'); // Navigate back to the dashboard after success
      } else {
        setError('Failed to update profile picture.');
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError('An error occurred while uploading the profile picture.');
    }
  };

  return (
    <div className="container">
      <h1>Change Profile Picture</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handlePfpSubmit} encType="multipart/form-data">
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit" className="btn btn-primary mt-4">Upload</button>
      </form>
    </div>
  );
};

export default ChangePfp;
