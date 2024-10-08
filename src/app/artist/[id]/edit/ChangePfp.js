"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ChangePfp = ({ artistId }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  console.log('Artist ID in ChangePfp component:', artistId);
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
    formData.append('artistId', artistId);

    console.log('Submitting formData:');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    try {
      const response = await fetch(`/api/artist/${artistId}/pfp`, {
        method: 'POST',
        headers: {
          'artistId': artistId, 
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Unexpected response from the server.');
        return;
      }
  
      setSuccess('Profile picture updated successfully!');
      router.push('/artist/dashboard');
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
          onChange={(e) => {
            setProfilePicture(e.target.files[0]);  
            console.log('Selected file:', e.target.files[0]);
          }}
        />
        <button type="submit" className="btn btn-primary mt-4">Upload</button>
      </form>
    </div>
  );
};

export default ChangePfp;
