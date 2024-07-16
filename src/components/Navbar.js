"use client";

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" href="/">Music Platform</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" href="/?page=create-competition">Create Competition</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=donate">Donate</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=profile">Profile</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=upload-music">Upload Music</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=view-results">View Results</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=forum">Forum</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=announcements">Announcements</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
