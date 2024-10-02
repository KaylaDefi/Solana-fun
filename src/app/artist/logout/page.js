"use client";

import { useEffect } from 'react';
import { signOut } from 'next-auth/react'; 
import { useRouter } from 'next/navigation'; 

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    signOut({
      redirect: false,
    }).then(() => {
      router.push('/'); 
    });
  }, [router]);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Logging out...</h1>
      <p>You are being logged out. Please wait.</p>
    </div>
  );
};

export default Logout;
