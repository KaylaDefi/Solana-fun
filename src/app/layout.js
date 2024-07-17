"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import ConnectWallet from '../components/ConnectWallet';
import { WalletProviderContext } from '../utils/WalletContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <style>{`
          body {
            background-color: #1a1a1a;
            color: #ffffff;
            font-family: 'Roboto Condensed', sans-serif;
          }
        `}</style>
      </head>
      <body>
        <WalletProviderContext>
          <Navbar />
          <ConnectWallet />
          <div className="container mt-4">
            {children}
          </div>
        </WalletProviderContext>
      </body>
    </html>
  );
}
