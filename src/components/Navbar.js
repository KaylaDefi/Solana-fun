"use client";

import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

const Navbar = () => {
  const { connected } = useWallet();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" href="/">Music Platform</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" href="/?page=battle-of-the-bands">Battle of the Bands</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=profile">Profile</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=forum">Forum</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/?page=create-account">Create Account</Link>
          </li>
          {connected && (
            <li className="nav-item">
              <Link className="nav-link" href="/?page=user-history">My History</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
