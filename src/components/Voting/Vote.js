import { useState } from 'react';

const Vote = () => {
  const [competitionId, setCompetitionId] = useState('');
  const [artistId, setArtistId] = useState('');

  const handleVote = (e) => {
    e.preventDefault();
    // Add logic to vote for an artist
    console.log('Voted for artist:', artistId, 'in competition:', competitionId);
  };

  return (
    <form onSubmit={handleVote} className="space-y-4">
      <div>
        <label htmlFor="competitionId" className="block text-sm font-medium text-gray-700">Competition ID</label>
        <input
          type="text"
          id="competitionId"
          value={competitionId}
          onChange={(e) => setCompetitionId(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="artistId" className="block text-sm font-medium text-gray-700">Artist ID</label>
        <input
          type="text"
          id="artistId"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">Vote</button>
    </form>
  );
};

export default Vote;
