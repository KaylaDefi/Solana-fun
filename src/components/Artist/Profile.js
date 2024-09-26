// src/components/Artist/Profile.js
"use client";

import Link from 'next/link';
import Announcements from './Announcements';

const Profile = () => {
  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Artist Profile</h1>
      <Link href="/?page=donate" legacyBehavior>
        <a className="btn btn-primary mb-4">Donate</a>
      </Link>
      <Link href="/?page=upload-music" legacyBehavior>
        <a className="btn btn-secondary mb-4">Upload Music</a>
      </Link>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        <Announcements />
      </div>
    </div>
  );
};

export default Profile;
