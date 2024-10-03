"use client";  

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import Announcements from '../../shared/Announcements';

const ArtistProfileView = ({ params }) => {
  const { data: session, status } = useSession();  
  const [artist, setArtist] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const router = useRouter(); 

  const artistId = params.id;  

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const res = await fetch(`/api/artist/${artistId}`);
        if (!res.ok) throw new Error('Failed to fetch artist data');
        const data = await res.json();
        setArtist(data.artist);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchArtistData();
    }

    if (status === 'unauthenticated') {
      router.push('/artist/login');
    }
  }, [status, artistId, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!artist) {
    return <p>Artist not found</p>;
  }

  return (
    <div>
      <h1>{artist.name}'s Profile</h1>
      <p>{artist.bio}</p>
      <p>Solana Wallet: {artist.solanaWallet || 'Not provided'}</p>
      {artist.profilePictureUrl && <img src={artist.profilePictureUrl} alt="Profile" />}
      
      {session?.user?.sub === artist._id && (
        <Link href={`/artist/${artist._id}/edit`} className="btn btn-primary">
          Edit Profile
        </Link>
      )}

      <Announcements />
    </div>
  );
};

export default ArtistProfileView;
