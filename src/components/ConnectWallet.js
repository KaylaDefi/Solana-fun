"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ConnectWallet = () => {
  return (
    <div className="absolute top-4 right-4">
      <WalletMultiButton />
    </div>
  );
};

export default ConnectWallet;
