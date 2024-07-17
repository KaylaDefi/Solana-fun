"use client";

import { useState } from 'react';

const UploadMusic = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle music upload
    console.log('Title:', title);
    console.log('File:', file);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload Music</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadMusic;

