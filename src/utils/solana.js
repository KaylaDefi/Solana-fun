import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('mainnet-beta'));

export const getBalance = async (publicKey) => {
  const balance = await connection.getBalance(new PublicKey(publicKey));
  return balance / 1e9; // Convert lamports to SOL
};

export const sendTransaction = async (transaction, wallet) => {
  const signature = await wallet.sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, 'processed');
  return signature;
};

