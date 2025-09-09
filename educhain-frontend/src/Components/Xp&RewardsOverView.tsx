import React, { useState, useEffect } from 'react';
import XPService, { UserXP, Achievement, NFT } from '../services/xpService';

// 1. Define Prop Interfaces for Reusable Button Components
interface ButtonProps {
  children: React.ReactNode; // Can be string, number, array, or other React elements
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; // Explicitly define onClick as a function that takes a MouseEvent
  className?: string; // className is optional
}

const PrimaryButton: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-green-500 text-black font-semibold py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-slate-700 text-white font-semibold py-2 px-4 rounded hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 ${className}`}
  >
    {children}
  </button>
);

interface DetailButtonProps {
  children?: string; // children is optional for DetailButton, defaults to 'Details'
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const DetailButton: React.FC<DetailButtonProps> = ({ children = 'Details', onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`text-green-500 hover:text-green-400 font-semibold text-sm ${className}`}
  >
    {children}
  </button>
);

interface TabButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ children, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-400 hover:bg-blue-700 hover:text-white'
    }`}
  >
    {children}
  </button>
);

// 2. Define Prop Interface for CredentialCard
interface CredentialCardProps {
  title: string;
  status: string;
  description: string;
  id?: string; // id is optional as not all cards have it
  onClickView: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ title, status, description, id, onClickView }) => (
  <div className="bg-slate-700 p-4 rounded-lg shadow-sm flex flex-col items-start text-white w-full">
    <div className="flex justify-between items-center w-full mb-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <span className={`text-xs px-2 py-1 rounded-full ${status === 'Minted' ? 'bg-green-600 text-black' : 'bg-yellow-600 text-black'}`}>
        {status}
      </span>
    </div>
    <p className="text-gray-400 text-sm mb-2">{description}</p>
    {id && <p className="text-gray-500 text-xs mb-3">ID: {id}</p>}
    <SecondaryButton onClick={onClickView} className="w-full">View</SecondaryButton>
  </div>
);


// Blockchain Verification Badge Component
const BlockchainBadge: React.FC<{ verified: boolean; size?: 'sm' | 'md' | 'lg' }> = ({
  verified,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded-full font-medium ${
      verified
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-gray-100 text-gray-600 border border-gray-200'
    } ${sizeClasses[size]}`}>
      {verified ? (
        <>
          <span className="text-green-600">⛓️</span>
          <span>Blockchain Verified</span>
        </>
      ) : (
        <>
          <span className="text-gray-500">⏳</span>
          <span>Pending Verification</span>
        </>
      )}
    </div>
  );
};

// XP Progress Bar Component
const XPProgressBar: React.FC<{ currentXP: number; nextLevelXP: number; currentLevel: number }> = ({
  currentXP,
  nextLevelXP,
  currentLevel
}) => {
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-1000 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="text-center text-xs text-gray-300 mt-1">
        Level {currentLevel}: {currentXP} / {nextLevelXP} XP
      </div>
    </div>
  );
};

// Achievement Card Component
const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const rarityColors = {
    common: 'border-gray-400 bg-gray-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-orange-400 bg-orange-50',
    mythic: 'border-red-400 bg-red-50'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${rarityColors[achievement.rarity]} ${
      achievement.unlocked ? 'opacity-100' : 'opacity-50'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{achievement.icon}</span>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{achievement.name}</h4>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
        {achievement.unlocked && (
          <BlockchainBadge verified={achievement.blockchainVerified} size="sm" />
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-green-600">
          +{achievement.xpReward} XP
        </span>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
          achievement.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
          achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
          achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
          achievement.rarity === 'legendary' ? 'bg-orange-200 text-orange-700' :
          'bg-red-200 text-red-700'
        }`}>
          {achievement.rarity}
        </span>
      </div>

      {achievement.unlocked && achievement.unlockedAt && (
        <p className="text-xs text-gray-500 mt-2">
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

// NFT Card Component
const NFTCard: React.FC<{ nft: NFT }> = ({ nft }) => {
  const rarityColors = {
    common: 'border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100',
    rare: 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100',
    epic: 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100',
    legendary: 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100',
    mythic: 'border-red-400 bg-gradient-to-br from-red-50 to-red-100'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${rarityColors[nft.rarity as keyof typeof rarityColors]} shadow-lg`}>
      <div className="text-center mb-3">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
        <h4 className="font-bold text-gray-900">{nft.name}</h4>
        <p className="text-sm text-gray-600">{nft.description}</p>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Achievement:</span>
          <span className="font-medium">{nft.achievement}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Rarity:</span>
          <span className={`font-medium capitalize px-2 py-1 rounded-full text-xs ${
            nft.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
            nft.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
            nft.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
            nft.rarity === 'legendary' ? 'bg-orange-200 text-orange-700' :
            'bg-red-200 text-red-700'
          }`}>
            {nft.rarity}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Minted:</span>
          <span className="font-medium">{new Date(nft.mintedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Token ID:</span>
          <span className="font-mono text-xs">{nft.tokenId.slice(0, 8)}...</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <BlockchainBadge verified={true} size="sm" />
      </div>
    </div>
  );
};

export default function XpAndRewards() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadXPData();
  }, []);

  const loadXPData = async () => {
    try {
      setLoading(true);
      // Initialize demo data if not exists
      await XPService.initializeDemoData('demo_user');

      const xpData = XPService.getUserXP('demo_user');
      const leaderboardData = await XPService.getLeaderboard();

      setUserXP(xpData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading XP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const awardTestXP = async (amount: number, reason: string) => {
    if (!userXP) return;

    try {
      const updatedXP = await XPService.awardXP('demo_user', amount, reason);
      setUserXP(updatedXP);
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  // Helper function for onClick handlers to avoid creating new functions in render for simplicity
  const handleTabClick = (tabName: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(tabName);
  };

  const handleDetailsClick = (source: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(`Details clicked for: ${source}`);
    // Implement navigation or modal display here
  };

  const handleClaimClick = (source: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(`Claim clicked for: ${source}`);
    // Implement claim logic here
  };

  const handleViewCredential = (credentialId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(`View credential: ${credentialId}`);
    // Implement navigation to credential details page
  };

  const handlePreviewSmartContractSecurity = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Preview Smart Contract Security clicked');
    // Implement navigation or modal for preview
  };

  const handleRedeemClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Redeem clicked');
    // Implement redeem logic
  };

  const handleTestXP = (amount: number, reason: string) => async () => {
    await awardTestXP(amount, reason);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Loading XP data...</p>
        </div>
      </div>
    );
  }

  if (!userXP) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Failed to load XP data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
      {/* Blockchain Uniqueness Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-2xl text-white mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">⛓️</div>
            <div>
              <h1 className="text-3xl font-bold">Blockchain Learning Rewards</h1>
              <p className="text-purple-100">Your achievements are permanently recorded on Sui blockchain</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              <span>On-chain XP tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              <span>NFT achievement rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              <span>Decentralized credentials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - XP Overview & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* XP Overview */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
            <div className="flex border-b border-slate-700 pb-2 mb-4">
              <TabButton isActive={activeTab === 'Overview'} onClick={handleTabClick('Overview')}>Overview</TabButton>
              <TabButton isActive={activeTab === 'Achievements'} onClick={handleTabClick('Achievements')}>Achievements</TabButton>
              <TabButton isActive={activeTab === 'NFTs'} onClick={handleTabClick('NFTs')}>NFTs</TabButton>
            </div>

            {activeTab === 'Overview' && (
              <div className="space-y-6">
                {/* XP Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total XP</p>
                    <p className="text-2xl font-bold text-green-400">{userXP.totalXP}</p>
                    <BlockchainBadge verified={true} size="sm" />
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Current Level</p>
                    <p className="text-2xl font-bold text-blue-400">{userXP.currentLevel}</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Available XP</p>
                    <p className="text-2xl font-bold text-white">{userXP.availableXP}</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">NFTs Earned</p>
                    <p className="text-2xl font-bold text-purple-400">{userXP.nfts.length}</p>
                  </div>
                </div>

                {/* XP Progress Bar */}
                <div>
                  <XPProgressBar
                    currentXP={userXP.totalXP}
                    nextLevelXP={userXP.nextLevelXP}
                    currentLevel={userXP.currentLevel}
                  />
                </div>

                {/* Recent XP Activity */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Recent Blockchain Activity</h3>
                  <div className="space-y-3">
                    {userXP.transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {transaction.type === 'lesson_completion' ? '📚' :
                             transaction.type === 'quiz_completion' ? '🎯' :
                             transaction.type === 'course_completion' ? '🎓' :
                             transaction.type === 'daily_login' ? '🔥' :
                             transaction.type === 'achievement' ? '🏆' : '⭐'}
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.reason}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">+{transaction.amount} XP</p>
                          {transaction.txHash && (
                            <p className="text-xs text-gray-500 font-mono">
                              {transaction.txHash.slice(0, 8)}...
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Achievements' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Achievement Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userXP.achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'NFTs' && (
              <div>
                <h3 className="text-xl font-bold mb-4">NFT Collection</h3>
                {userXP.nfts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-gray-400">No NFTs earned yet</p>
                    <p className="text-sm text-gray-500">Complete achievements to earn unique NFTs</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userXP.nfts.map((nft) => (
                      <NFTCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar - Leaderboard & Testing Tools */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">🏆 Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-slate-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.userId}</p>
                      <p className="text-sm text-gray-400">Level {user.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{user.totalXP} XP</p>
                    <p className="text-sm text-gray-400">{user.achievements} achievements</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP Testing Tools (for demo purposes) */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">🧪 XP Testing Tools</h3>
            <div className="space-y-3">
              <button
                onClick={handleTestXP(50, 'Test lesson completion')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                +50 XP (Lesson)
              </button>
              <button
                onClick={handleTestXP(100, 'Test quiz completion')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                +100 XP (Quiz)
              </button>
              <button
                onClick={handleTestXP(200, 'Test course completion')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                +200 XP (Course)
              </button>
              <button
                onClick={handleTestXP(10, 'Test daily login')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                +10 XP (Login)
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Demo tools - in production, XP is awarded by smart contracts
            </p>
          </div>

          {/* Web3 Uniqueness Highlight */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-3">🚀 Why EduChain is Different</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <div>
                  <p className="font-medium">Blockchain-Verified Learning</p>
                  <p className="text-purple-100">Every achievement is permanently recorded on Sui</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <div>
                  <p className="font-medium">NFT Achievement Rewards</p>
                  <p className="text-purple-100">Earn unique digital badges you truly own</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <div>
                  <p className="font-medium">Move Programming Focus</p>
                  <p className="text-purple-100">Learn the language powering next-gen blockchains</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <div>
                  <p className="font-medium">Decentralized Credentials</p>
                  <p className="text-purple-100">No central authority can revoke your achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}