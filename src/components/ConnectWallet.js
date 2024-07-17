"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ConnectWallet = () => {
  return (
    <div className="position-absolute top-4 right-4 z-50">
      <WalletMultiButton className="wallet-adapter-button-trigger" />
    </div>
  );
};

export default ConnectWallet;
