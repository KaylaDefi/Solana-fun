"use client";

import Link from 'next/link';
import Announcements from './Announcements';

const Profile = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Artist Profile</h1>
      {/* Profile information here */}
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Create NFTs</h2>
        <p>Coming soon: Artists will be able to create NFTs as rewards for donations or votes.</p>
      </div>
      {/* More profile details */}
    </div>
  );
};

export default Profile;
