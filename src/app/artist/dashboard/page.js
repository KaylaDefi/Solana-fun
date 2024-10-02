"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; 
import { fetchDataFromApi } from '../../../utils/api'; 

const Dashboard = () => {
  const { data: session, status } = useSession(); 
  const [artistData, setArtistData] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [donations, setDonations] = useState({ totalAmount: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      async function fetchData() {
        setLoading(true);
        try {
          const res = await fetchDataFromApi('/api/artist/dashboard');
          setArtistData(res.artistData);
          setCompetitions(res.competitions);
          setDonations(res.donations);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError('Failed to load dashboard data.');
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [session, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-4">Welcome, {artistData?.name}</h1>

      {/* Profile Details */}
      <section>
        <h2>Profile Details</h2>
        <p><strong>Name:</strong> {artistData?.name}</p>
        <p><strong>Bio:</strong> {artistData?.bio}</p>
        <p><strong>Solana Wallet:</strong> {artistData?.solanaWallet}</p>
        {artistData?.profilePictureUrl ? (
          <div>
            <img
              src={artistData.profilePictureUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
          </div>
        ) : (
          <p>No profile picture uploaded</p>
        )}

        {/* Edit Profile Button */}
        <Link href={`/artist/${artistData?._id}/edit`} className="btn btn-primary mt-4">
          Edit Profile
        </Link>
      </section>

      {/* Competitions Section */}
      <section className="mt-6">
        <h2>Current Competitions</h2>
        {competitions.length > 0 ? (
          competitions.map((comp) => (
            <div key={comp._id}>
              <p><strong>{comp.name}</strong></p>
              <p>Votes: {comp.votes}</p>
              <Link href={`/competition/${comp._id}`} className="btn btn-secondary">
                View Competition
              </Link>
            </div>
          ))
        ) : (
          <p>No active competitions.</p>
        )}
      </section>

      {/* Donations Section */}
      <section className="mt-6">
        <h2>Donations</h2>
        <p><strong>Total Donations:</strong> {donations.totalAmount} SOL</p>
        <ul>
          {donations.recent.map((donation, index) => (
            <li key={index}>{donation.amount} SOL from {donation.donor}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
