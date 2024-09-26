import Announcements from '../../../components/Artist/Announcements';
import Link from 'next/link';
import { useState } from 'react';
import jwt from 'jsonwebtoken';

const ArtistProfileView = ({ artist, loggedInArtistId }) => {
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

      {/* Only show the "Update Artist Profile" button if the logged-in user is the artist */}
      {loggedInArtistId === artist._id && (
        <Link href={`/artist/${artist._id}/edit`} legacyBehavior>
          <a className="btn btn-secondary mb-4">Update Artist Profile</a>
        </Link>
      )}
    </div>
  );
};

// Fetch artist data from server-side and handle authentication with JWT from cookies
export async function getServerSideProps({ req, params }) {
  const token = req.cookies.token;  // Access token from the cookie

  // If no token is available, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch artist data from your API or database using the artist ID from the URL params
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist/${params.id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch artist with ID: ${params.id}`);
    }

    const artist = await res.json();

    return {
      props: {
        artist,
        loggedInArtistId: decodedToken.artistId,  // Pass the logged-in artist's ID to the component
      },
    };
  } catch (error) {
    console.error('Error fetching artist or verifying token:', error);

    // If token is invalid or expired, redirect to login
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}

export default ArtistProfileView;
