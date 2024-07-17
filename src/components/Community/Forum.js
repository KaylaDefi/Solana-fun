"use client";

import { useState, useEffect } from 'react';

const Forum = () => {
  const [forums, setForums] = useState([]);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedForum, setSelectedForum] = useState(null);

  useEffect(() => {
    // Fetch forums from backend
    setForums([
      { id: 1, title: 'General Discussion', posts: [{ content: 'Welcome to the forum!', author: 'User1' }] },
      { id: 2, title: 'Music Releases', posts: [{ content: 'Check out my new song!', author: 'Artist1' }] },
    ]);
  }, []);

  const handleCreateForum = () => {
    // Logic to create a new forum
    setForums([...forums, { id: forums.length + 1, title: newForumTitle, posts: [] }]);
    setNewForumTitle('');
  };

  const handleCreatePost = () => {
    // Logic to create a new post in the selected forum
    const updatedForums = forums.map((forum) => {
      if (forum.id === selectedForum.id) {
        return { ...forum, posts: [...forum.posts, { content: newPostContent, author: 'CurrentUser' }] };
      }
      return forum;
    });
    setForums(updatedForums);
    setNewPostContent('');
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-accent mb-6">Forums</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Create New Forum</label>
        <input
          type="text"
          value={newForumTitle}
          onChange={(e) => setNewForumTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-background text-white"
        />
        <button onClick={handleCreateForum} className="mt-2 px-4 py-2 bg-primary text-white rounded-md">
          Create Forum
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Forums</label>
        <ul>
          {forums.map((forum) => (
            <li key={forum.id} onClick={() => setSelectedForum(forum)} className="cursor-pointer mb-2 text-secondary">
              {forum.title}
            </li>
          ))}
        </ul>
      </div>
      {selectedForum && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-accent">{selectedForum.title}</h2>
          <ul className="mb-4">
            {selectedForum.posts.map((post, index) => (
              <li key={index} className="mb-2 text-gray-300">
                <strong className="text-secondary">{post.author}:</strong> {post.content}
              </li>
            ))}
          </ul>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">New Post</label>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-background text-white"
            ></textarea>
            <button onClick={handleCreatePost} className="mt-2 px-4 py-2 bg-primary text-white rounded-md">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
