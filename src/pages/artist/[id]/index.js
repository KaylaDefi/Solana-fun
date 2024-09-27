import Announcements from '../../../components/Artist/Announcements';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const ArtistProfileView = ({ artist }) => {
  const [loggedInArtistId, setLoggedInArtistId] = useState(null);

  useEffect(() => {
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

      {loggedInArtistId === artist._id && (
        <Link href={`/artist/${artist._id}/edit`} legacyBehavior>
          <a className="btn btn-secondary mb-4">Update Artist Profile</a>
        </Link>
      )}
    </div>
  );
};

// Here's where the `getServerSideProps` function goes!
export async function getServerSideProps({ params, req }) {
  const token = req.cookies.token; // Access token from cookies

  if (!token) {
    return {
      redirect: {
        destination: '/artist/login', // Redirect to login if no token
        permanent: false,
      },
    };
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist/${params.id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch artist with ID: ${params.id}`);
    }

    const artist = await res.json();

    // Ensure the logged-in artist can only view/edit their own profile
    if (decodedToken.artistId !== params.id) {
      return {
        redirect: {
          destination: '/artist/login',
          permanent: false,
        },
      };
    }

    return { props: { artist } };
  } catch (error) {
    console.error('Error fetching artist or verifying token:', error);
    return {
      redirect: {
        destination: '/artist/login',
        permanent: false,
      },
    };
  }
}

export default ArtistProfileView;
