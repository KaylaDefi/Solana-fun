"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation'; 
import ChangePfp from '../[id]/edit/ChangePfp'; 
import { fetchDataFromApi } from '../../../utils/api'; 
import Announcements from '../../shared/Announcements'; 

const Dashboard = () => {
  const { data: session, status } = useSession(); 
  const [artistData, setArtistData] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [donations, setDonations] = useState({ totalAmount: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChangePfp, setShowChangePfp] = useState(false);
  const [showModal, setShowModal] = useState(false);  
  const router = useRouter();

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

    if (status === 'unauthenticated') {
      router.push('/artist/login');
    }
  }, [session, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleChangePfp = () => setShowChangePfp(!showChangePfp);
  
  const handleModalOpen = () => {
    if (artistData?.profilePictureUrl) {
      console.log("Opening modal...");
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    console.log("Closing modal...");
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-4">Welcome, {artistData?.name}</h1>

      <section>
        <h2>Profile Details</h2>

        <div className="cursor-pointer mt-4">
          {artistData?.profilePictureUrl ? (
            <img
              src={artistData.profilePictureUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full"
              style={{
                maxWidth: '150px', 
                maxHeight: '150px',
                objectFit: 'cover',
              }}
              onClick={handleModalOpen}  
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#ccc',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>Click to upload profile picture</span>
            </div>
          )}
        </div>

        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleModalClose}  
          >
            <div className="modal-content rounded-lg">
              <img
                src={artistData?.profilePictureUrl}
                alt="Enlarged Profile"
                className="max-w-full max-h-full"
                style={{ maxHeight: '90vh', maxWidth: '90vw' }} 
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <button
          className="btn btn-secondary mt-2"
          onClick={handleChangePfp}
        >
          {showChangePfp ? "Cancel" : "Change Profile Picture"}
        </button>

        {showChangePfp && <ChangePfp artistId={artistData?._id} />}

        <p><strong>Name:</strong> {artistData?.name}</p>
        <p><strong>Bio:</strong> {artistData?.bio}</p>
        <p><strong>Solana Wallet:</strong> {artistData?.solanaWallet}</p>

        <Link href={`/artist/${artistData?._id}/edit`}>
            <button className="btn btn-secondary mt-2">
            Edit Profile Details</button>
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

      {/* Announcements Section */}
      <Announcements />
    </div>
  );
};

export default Dashboard;
