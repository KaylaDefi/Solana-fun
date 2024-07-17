"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import FeaturedArtists from '../components/Home/FeaturedArtists';
import OngoingCompetitions from '../components/Home/OngoingCompetitions';
import CreateAccount from '../components/Home/CreateAccount';
import Donate from '../components/Artist/Donate';
import Profile from '../components/Artist/Profile';
import UploadMusic from '../components/Artist/UploadMusic';
import ViewResults from '../components/Voting/ViewResults';
import Forums from '../components/Community/Forum';
import Announcements from '../components/Community/Announcements';
import UserHistory from '../components/UserHistory';

export default function Home() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const renderComponent = () => {
    switch (page) {
      case 'create-account':
        return <CreateAccount />;
      case 'donate':
        return <Donate />;
      case 'profile':
        return <Profile />;
      case 'upload-music':
        return <UploadMusic />;
      case 'view-results':
        return <ViewResults />;
      case 'forums':
        return <Forums />;
      case 'announcements':
        return <Announcements />;
      case 'user-history':
        return <UserHistory />;
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
