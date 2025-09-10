import React, { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useAuth } from '../contexts/AuthContext';

export default function WalletAuth() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const { user, login, isLoading } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletAuth = async () => {
    if (!currentAccount?.address) {
      alert('Please connect your Sui wallet first');
      return;
    }

    try {
      setIsConnecting(true);

     
      await login(currentAccount.address);

    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (user) {
    return (
      <div className="bg-green-800 text-white px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm">
            Connected: {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
          </span>
        </div>
        <div className="text-xs text-green-200 mt-1">
          Level {user.currentLevel} • {user.totalXP} XP
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleWalletAuth}
      disabled={isConnecting || isLoading}
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
        isConnecting || isLoading
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {isConnecting || isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Connecting...</span>
        </div>
      ) : currentAccount ? (
        'Sign In with Wallet'
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}