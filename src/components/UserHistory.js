"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

const UserHistory = () => {
  const { publicKey } = useWallet();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (publicKey) {
      // Fetch user transaction history from backend
      setHistory([
        { id: 1, type: 'vote', detail: 'Voted in Competition 1' },
        { id: 2, type: 'donation', detail: 'Donated to Artist 2' },
        { id: 3, type: 'nft', detail: 'Received NFT from Artist 1' },
      ]);
    }
  }, [publicKey]);

  return (
    <div className="space-y-4 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center">Transaction History</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id} className="border-b py-2">
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Detail:</strong> {item.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHistory;
