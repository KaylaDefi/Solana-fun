"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

const BattleOfTheBands = () => {
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    // Fetch competitions from backend
    setCompetitions([
      { id: 1, name: 'Competition 1', description: 'Description of Competition 1', status: 'open' },
      { id: 2, name: 'Competition 2', description: 'Description of Competition 2', status: 'ongoing' },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Battle of the Bands</h1>
      <ul>
        {competitions.map((competition) => (
          <li key={competition.id} className="mb-4">
            <Link href={`/?page=competition&id=${competition.id}`} legacyBehavior>
              <a>
                <h2 className="text-xl font-semibold">{competition.name}</h2>
                <p>{competition.description}</p>
                <p>Status: {competition.status}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BattleOfTheBands;

