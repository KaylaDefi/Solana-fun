"use client";

const OngoingCompetitions = () => {
  const competitions = [
    { id: 1, name: 'Competition 1', description: 'Description of Competition 1' },
    { id: 2, name: 'Competition 2', description: 'Description of Competition 2' },
    { id: 3, name: 'Competition 3', description: 'Description of Competition 3' },
  ];

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-accent mb-4">Ongoing Competitions</h2>
      <ul className="list-none">
        {competitions.map((competition) => (
          <li key={competition.id} className="mb-4">
            <div className="bg-background p-4 rounded-lg shadow-md hover:bg-surface transition">
              <h3 className="text-xl font-semibold text-secondary">{competition.name}</h3>
              <p className="text-gray-300">{competition.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OngoingCompetitions;
