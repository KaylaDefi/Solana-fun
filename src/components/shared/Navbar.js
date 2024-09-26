"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is loaded, including Popper.js

const Navbar = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-background text-white">
      <div className="container-fluid">
        <Link className="navbar-brand text-primary font-bold" href="/">Music Platform</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white" href="/?page=battle-of-the-bands">Battle of the Bands</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/?page=forum">Forum</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/artist/create-account">Create Account</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/artist/login">Artist Login</Link> 
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
