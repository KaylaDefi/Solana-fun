"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import FeaturedArtists from '../components/Home/FeaturedArtists';
import OngoingCompetitions from '../components/Home/OngoingCompetitions';
import CreateAccount from '../components/Home/CreateAccount';
import BattleOfTheBands from '../components/BattleOfTheBands';
import CompetitionDetails from '../components/CompetitionDetails';
import Profile from '../components/Artist/Profile';
import Forum from '../components/Community/Forum'; 
import UserHistory from '../components/UserHistory';
import Donate from '../components/Artist/Donate';
import UploadMusic from '../components/Artist/UploadMusic';
import Announcements from '../components/Artist/Announcements';


export default function Home() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const competitionId = searchParams.get('id');

  const renderComponent = () => {
    switch (page) {
      case 'create-account':
        return <CreateAccount />;
      case 'battle-of-the-bands':
        return <BattleOfTheBands />;
      case 'competition':
        return <CompetitionDetails id={competitionId} />;
      case 'profile':
        return <Profile />;
      case 'forum': 
        return <Forum />; 
      case 'user-history':
        return <UserHistory />;
      case 'donate':
        return <Donate />;
      case 'upload-music':
        return <UploadMusic />;
      case 'announcements':
        return <Announcements />;
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Music Platform</h1>
            <FeaturedArtists />
            <OngoingCompetitions />
          </div>
        );
    }
  };

  return (
    <div>
      <Head>
        <title>Music Platform</title>
        <meta name="description" content="A decentralized music platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4 space-y-8">
        {renderComponent()}
      </main>
    </div>
  );
}
