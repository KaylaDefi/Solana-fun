import { useState } from 'react';
import { useRouter } from 'next/router';

const ArtistProfileEdit = ({ artist }) => {
  const router = useRouter();

  if (!artist) {
    return <div>Error: Artist not found or failed to load.</div>;  
  }

  const [name, setName] = useState(artist.name);
  const [bio, setBio] = useState(artist.bio);
  const [solanaWallet, setSolanaWallet] = useState(artist.solanaWallet || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('solanaWallet', solanaWallet);

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch(`/api/artist/${artist._id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include', 
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        router.push(`/artist/${artist._id}`);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating the profile.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Solana Wallet Address</label>
          <input
            type="text"
            value={solanaWallet}
            onChange={(e) => setSolanaWallet(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
          Save
        </button>
      </form>
    </div>
  );
};

// Fetch artist data from server-side
export async function getServerSideProps({ params, req }) {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'; 

  try {
    const response = await fetch(`${apiUrl}/api/artist/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch artist');
    }

    const artist = await response.json();

    return { props: { artist: artist || null } };
  } catch (error) {
    console.error('Error fetching artist:', error);
    return { props: { artist: null } };
  }
}

export default ArtistProfileEdit;
