"use client";

import { useState, useEffect } from 'react';

const Forums = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // Fetch forum topics from backend
    setTopics([
      { id: 1, title: 'Topic 1', content: 'This is the first topic.' },
      { id: 2, title: 'Topic 2', content: 'This is the second topic.' },
    ]);
  }, []);

  return (
    <div className="space-y-4 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center">Community Forums</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id} className="border-b py-2">
            <h3 className="font-medium">{topic.title}</h3>
            <p>{topic.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Forums;
