import Announcements from '../../../components/Artist/Announcements';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode'; // To decode the JWT and verify the artist

const ArtistProfileView = ({ artist }) => {
  const [loggedInArtistId, setLoggedInArtistId] = useState(null);

  useEffect(() => {
    // Check if the JWT token exists and decode it
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      setLoggedInArtistId(decodedToken.artistId);
    }
  }, []);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">{artist.name}</h1>
      <p className="mb-4"><strong>Bio:</strong> {artist.bio}</p>

      <Link href="/?page=donate" legacyBehavior>
        <a className="btn btn-primary mb-4">Donate</a>
      </Link>
      <Link href="/?page=upload-music" legacyBehavior>
        <a className="btn btn-secondary mb-4">Upload Music</a>
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        <Announcements />
      </div>

      {/* Show the Update Profile link only for the logged-in artist */}
      {loggedInArtistId === artist._id && (
        <Link href={`/artist/${artist._id}/edit`} legacyBehavior>
          <a className="btn btn-secondary mb-4">Update Artist Profile</a>
        </Link>
      )}
    </div>
  );
};

// Fetch artist data from an API or server-side
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`http://localhost:5001/api/artist/${params.id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch artist with ID: ${params.id}`);
    }

    const artist = await res.json();
    return { props: { artist } };
  } catch (error) {
    console.error('Error fetching artist:', error);
    return { props: { artist: null } };
  }
}

export default ArtistProfileView;
