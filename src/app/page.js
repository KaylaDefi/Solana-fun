"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import CreateCompetition from '../components/Voting/CreateCompetition';
import Donate from '../components/Artist/Donate';
import Profile from '../components/Artist/Profile';
import UploadMusic from '../components/Artist/UploadMusic';
import ViewResults from '../components/Voting/ViewResults';
import Forums from '../components/Community/Forum';
import Announcements from '../components/Community/Announcements';

export default function Home() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const artistPublicKey = 'YourArtistPublicKeyHere'; // Replace with a valid Solana public key

  const renderComponent = () => {
    switch (page) {
      case 'create-competition':
        return <CreateCompetition />;
      case 'donate':
        return <Donate artistPublicKey={artistPublicKey} />;
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
      default:
        return <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Music Platform</h1>;
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

