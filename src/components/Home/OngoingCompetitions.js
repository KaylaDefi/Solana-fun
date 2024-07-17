"use client";

import { useEffect, useState } from 'react';

const OngoingCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    // Fetch ongoing competitions from backend
    setCompetitions([
      { id: 1, name: 'Competition 1', description: 'Description of Competition 1' },
      { id: 2, name: 'Competition 2', description: 'Description of Competition 2' },
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Ongoing Competitions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitions.map((competition) => (
          <div key={competition.id} className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold">{competition.name}</h3>
            <p>{competition.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OngoingCompetitions;
