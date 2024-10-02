"use client";

import Link from 'next/link';
import Announcements from '../shared/Announcements';

const ArtistActions = () => {
  return (
    <div className="container">
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

export default ArtistActions;

