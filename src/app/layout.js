"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import Navbar from './shared/Navbar';
import ConnectWallet from './shared/ConnectWallet';
import { WalletProviderContext } from '../utils/WalletContext';
import { SessionProvider } from 'next-auth/react'; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
           crossOrigin="anonymous"
        />

        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SessionProvider>
          <WalletProviderContext>
            <Navbar />
            <ConnectWallet />
            <div className="container mt-4">
              {children}
            </div>
          </WalletProviderContext>
        </SessionProvider>
      </body>
    </html>
  );
}
