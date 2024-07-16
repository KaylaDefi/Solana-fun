"use client";

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';

const Donate = ({ artistPublicKey }) => {
  const [amount, setAmount] = useState('');
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection(clusterApiUrl('mainnet-beta'));

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(artistPublicKey),
        lamports,
      })
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      alert('Donation successful!');
      setAmount(''); // Clear the input field
    } catch (error) {
      console.error('Donation failed', error);
      alert('Donation failed, please try again.');
    }
  };

  return (
    <form onSubmit={handleDonate} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (SOL)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          min="0"
          step="0.01"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-md">Donate</button>
    </form>
  );
};

export default Donate;
