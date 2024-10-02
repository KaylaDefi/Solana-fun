"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSession } from 'next-auth/react';

const ArtistProfileEdit = ({ artist }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState(artist?.name || '');
  const [bio, setBio] = useState(artist?.bio || '');
  const [solanaWallet, setSolanaWallet] = useState(artist?.solanaWallet || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/artist/login'); 
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    if (name && name !== artist.name) formData.append('name', name);
    if (bio && bio !== artist.bio) formData.append('bio', bio);
    if (solanaWallet && solanaWallet !== artist.solanaWallet) formData.append('solanaWallet', solanaWallet);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const response = await fetch(`/api/artist/${artist._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        router.push(`/artist/${artist._id}`);
      } else {
        setError('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error while updating profile:', error);
      setError('An error occurred.');
    }
  };

  return (
    <div className="container">
      <h1>Edit Profile</h1>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
        </div>

        <div>
          <label>Solana Wallet Address</label>
          <input type="text" value={solanaWallet} onChange={(e) => setSolanaWallet(e.target.value)} />
        </div>

        <div>
          <label>Upload Profile Picture</label>
          <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ArtistProfileEdit;
