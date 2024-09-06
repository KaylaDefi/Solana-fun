import { useState } from 'react';
import { useRouter } from 'next/router';

const ArtistProfileEdit = ({ artist }) => {
  const [name, setName] = useState(artist.name);
  const [bio, setBio] = useState(artist.bio);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/artist/${artist._id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, bio }),
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
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Save</button>
      </form>
    </div>
  );
};

// Fetch artist data from the server-side for editing purposes
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`http://localhost:5001/api/artist/${params.id}`);

    // Check if the response is OK (status code 200–299)
    if (!res.ok) {
      throw new Error(`Failed to fetch artist with ID: ${params.id}`);
    }

    // Parse the response as JSON
    const artist = await res.json();

    return { props: { artist } };
  } catch (error) {
    console.error('Error fetching artist:', error);

    // Return `artist: null` if there's an error
    return { props: { artist: null } };
  }
}

export default ArtistProfileEdit;
