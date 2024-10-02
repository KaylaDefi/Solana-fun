"use client";

import { useEffect, useState } from 'react';

const CompetitionDetails = ({ id }) => {
  const [competition, setCompetition] = useState(null);

  useEffect(() => {
    // Fetch competition details from backend
    setCompetition({
      id,
      name: 'Competition 1',
      description: 'Description of Competition 1',
      status: 'ongoing',
      results: [
        { artist: 'Artist 1', votes: 100 },
        { artist: 'Artist 2', votes: 50 },
      ],
    });
  }, [id]);

  if (!competition) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{competition.name}</h1>
      <p>{competition.description}</p>
      <h2 className="text-2xl font-semibold mt-4">Results</h2>
      <ul>
        {competition.results.map((result, index) => (
          <li key={index} className="mb-2">
            {result.artist}: {result.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompetitionDetails;
