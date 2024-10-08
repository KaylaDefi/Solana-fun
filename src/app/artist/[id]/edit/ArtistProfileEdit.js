"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSession } from 'next-auth/react'; 
import ChangePfp from './ChangePfp';  

const ArtistProfileEdit = ({ artist }) => {  
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState(artist?.name || '');
  const [bio, setBio] = useState(artist?.bio || '');
  const [solanaWallet, setSolanaWallet] = useState(artist?.solanaWallet || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePfp, setShowChangePfp] = useState(false); 

  useEffect(() => {
    if (!session) {
      router.push('/artist/login');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const updatedProfile = {
      name,
      bio,
      solanaWallet,
    };

    try {
      const response = await fetch(`/api/artist/${artist._id}`, {  
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        router.push(`/artist/dashboard`);
      } else {
        setError('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error while updating profile:', error);
      setError('An error occurred.');
    }
  };

  if (!session) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="container">
      <h1>Edit Profile</h1>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label>Solana Wallet Address</label>
          <input
            type="text"
            name="solanaWallet"
            value={solanaWallet}
            onChange={(e) => setSolanaWallet(e.target.value)}
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>

      <div className="mt-4">
        <button onClick={() => setShowChangePfp(!showChangePfp)}>
          {showChangePfp ? "Cancel" : "Change Profile Picture"}
        </button>

        {showChangePfp && <ChangePfp artistId={artist._id} />} 
      </div>
    </div>
  );
};

export default ArtistProfileEdit;
