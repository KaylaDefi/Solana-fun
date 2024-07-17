"use client";

const FeaturedArtists = () => {
  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-accent mb-4">Featured Artists</h2>
      <ul className="list-none">
        {/* List of featured artists */}
        <li className="mb-2">Artist 1</li>
        <li className="mb-2">Artist 2</li>
        <li className="mb-2">Artist 3</li>
      </ul>
    </div>
  );
};

export default FeaturedArtists;
