import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchDataFromApi } from '../../utils/api'; // Fetches data from API

const Dashboard = () => {
  const [artistData, setArtistData] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [donations, setDonations] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];  

        const res = await fetchDataFromApi('/api/artist/dashboard', 'GET', null, token);
        setArtistData(res.artistData);
        setCompetitions(res.competitions);
        setDonations(res.donations);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      }
    }
    fetchData();
  }, []);

  if (!artistData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-4">Welcome, {artistData.name}</h1>
      {/* Profile, competitions, donations */}
    </div>
  );
};

export default Dashboard;
