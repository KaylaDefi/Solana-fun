import Announcements from '../../shared/Announcements';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react'; 

const ArtistProfileView = ({ artist }) => {
  const { data: session } = useSession(); 
  const [loggedInArtistId, setLoggedInArtistId] = useState(null);

  useEffect(() => {
    if (session && session.artistId) {
      setLoggedInArtistId(session.artistId); 
    }
  }, [session]);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">{artist.name}</h1>
      <p className="mb-4"><strong>Bio:</strong> {artist.bio}</p>

      <Link href="/donate">
        <a className="btn btn-primary mb-4">Donate</a>
      </Link>
      <Link href="/upload-music">
        <a className="btn btn-secondary mb-4">Upload Music</a>
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        <Announcements />
      </div>

      {/* Allow editing the profile if the logged-in artist is viewing their own profile */}
      {loggedInArtistId === artist._id && (
        <Link href={`/artist/${artist._id}/edit`}>
          <a className="btn btn-secondary mb-4">Update Artist Profile</a>
        </Link>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/artist/login', 
        permanent: false,
      },
    };
  }

  try {
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers['host'];
    const apiUrl = `${protocol}://${host}/api/artist/${context.params.id}`;

    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch artist with ID: ${context.params.id}`);
    }

    const artist = await res.json();

    if (session.artistId !== context.params.id) {
      return {
        redirect: {
          destination: '/artist/login',
          permanent: false,
        },
      };
    }

    return { props: { artist } };
  } catch (error) {
    console.error('Error fetching artist:', error);
    return {
      redirect: {
        destination: '/artist/login',
        permanent: false,
      },
    };
  }
}

export default ArtistProfileView;
