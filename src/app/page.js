"use client";

import Head from 'next/head';
import { useSession } from 'next-auth/react';  
import FeaturedArtists from './home/FeaturedArtists';
import OngoingCompetitions from './home/OngoingCompetitions';

export default function Home() {
  const { data: session, status } = useSession();  

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Music Platform</title>
        <meta name="description" content="A decentralized music platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4 space-y-8">
        <div className="landing-page">
          <div className="landing-page-content">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Music Platform</h1>
            <FeaturedArtists />
            <OngoingCompetitions />
          </div>
        </div>
      </main>
    </div>
  );
}

