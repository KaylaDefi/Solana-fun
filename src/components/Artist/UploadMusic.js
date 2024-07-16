"use client";

import { useState } from 'react';

const UploadMusic = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to upload music
    console.log('Music uploaded:', { title, file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">Upload Music</button>
    </form>
  );
};

export default UploadMusic;
