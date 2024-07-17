"use client";

import { useState, useEffect } from 'react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch announcements from backend
    setAnnouncements([
      { id: 1, title: 'Announcement 1', content: 'This is the first announcement.' },
      { id: 2, title: 'Announcement 2', content: 'This is the second announcement.' },
    ]);
  }, []);

  return (
    <div className="space-y-4 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center">Announcements</h2>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement.id} className="border-b py-2">
            <h3 className="font-medium">{announcement.title}</h3>
            <p>{announcement.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
