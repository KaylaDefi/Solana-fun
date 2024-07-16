"use client";

import { useState, useEffect } from 'react';

const ViewResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch results from backend
    setResults([
      { id: 1, artist: 'Artist 1', votes: 100 },
      { id: 2, artist: 'Artist 2', votes: 80 },
    ]);
  }, []);

  return (
    <div className="space-y-4 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center">Competition Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.id} className="border-b py-2">
            <span className="font-medium">{result.artist}</span> - {result.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewResults;
