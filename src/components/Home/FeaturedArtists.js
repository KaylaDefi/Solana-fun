"use client";

import { useEffect, useState } from 'react';

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Fetch featured artists from backend
    setArtists([
      { id: 1, name: 'Artist 1', bio: 'Bio of Artist 1' },
      { id: 2, name: 'Artist 2', bio: 'Bio of Artist 2' },
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Featured Artists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <div key={artist.id} className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold">{artist.name}</h3>
            <p>{artist.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtists;
