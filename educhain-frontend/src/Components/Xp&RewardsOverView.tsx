import React, { useState, useEffect } from 'react';
import XPService, { UserXP, Achievement, NFT } from '../services/xpService';
import { getPlatformStats } from '../services/blockchainService';
import ConfigService, { AchievementConfig } from '../services/configService';



// Tab Button Component
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
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{achievement.icon || '🏆'}</span>
          <h4 className="font-bold text-gray-900">{achievement.name}</h4>
        </div>
        <p className="text-sm text-gray-600">{achievement.description}</p>
        {achievement.unlocked && (
          <div className="mt-2">
            <BlockchainBadge verified={achievement.blockchainVerified} size="sm" />
          </div>
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




export default function XpAndRewards() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockchainStats, setBlockchainStats] = useState<{
    totalUsers: number;
    totalCourses: number;
    totalXpAwarded: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [adminAchievements, setAdminAchievements] = useState<AchievementConfig[]>([]);

  useEffect(() => {
    loadXPData();
  }, []);

  const loadXPData = async () => {
    try {
      setLoading(true);
      // Initialize demo data if not exists
      await XPService.initializeDemoData('demo_user');

      const xpData = XPService.getUserXP('demo_user');

      setUserXP(xpData);

      // Load admin achievements
      const achievements = ConfigService.getAchievements();
      console.log('Loaded admin achievements:', achievements);
      setAdminAchievements(achievements);

      // Load blockchain stats
      await loadBlockchainStats();
    } catch (error) {
      console.error('Error loading XP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlockchainStats = async () => {
    try {
      setStatsLoading(true);
      const stats = await getPlatformStats();
      setBlockchainStats(stats);
    } catch (error) {
      console.error('Error loading blockchain stats:', error);
      // Set fallback values if blockchain call fails
      setBlockchainStats({
        totalUsers: 0,
        totalCourses: 0,
        totalXpAwarded: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  };


  // Helper function for onClick handlers to avoid creating new functions in render for simplicity
  const handleTabClick = (tabName: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(tabName);
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
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Blockchain Learning Rewards</h1>
            <p className="text-purple-100">Your achievements are permanently recorded on Sui blockchain</p>
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
                {/* Blockchain Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <h4 className="text-sm text-gray-400 mb-2">Total Users</h4>
                    {statsLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                    ) : (
                      <p className="text-2xl font-bold text-blue-400">{blockchainStats?.totalUsers || 0}</p>
                    )}
                    <p className="text-xs text-gray-500">On Sui blockchain</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <h4 className="text-sm text-gray-400 mb-2">Total Courses</h4>
                    {statsLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
                    ) : (
                      <p className="text-2xl font-bold text-green-400">{blockchainStats?.totalCourses || 0}</p>
                    )}
                    <p className="text-xs text-gray-500">Published courses</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <h4 className="text-sm text-gray-400 mb-2">XP Awarded</h4>
                    {statsLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
                    ) : (
                      <p className="text-2xl font-bold text-purple-400">{blockchainStats?.totalXpAwarded || 0}</p>
                    )}
                    <p className="text-xs text-gray-500">Blockchain verified</p>
                  </div>
                </div>

                {/* NFT Badge Section */}
                <div className="text-center">
                  <div className="text-2xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold mb-4">NFT Achievement Badges</h3>
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white">
                    <p className="text-lg font-semibold mb-2">Blockchain-Verified Achievements</p>
                    <p className="text-purple-100">Your NFT badges are permanently stored on Sui blockchain</p>
                    <div className="mt-4">
                      <BlockchainBadge verified={true} size="md" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Achievements' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Available Achievements</h3>
                        <p className="text-gray-400">Achievements created in the admin panel</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const achievements = ConfigService.getAchievements();
                        console.log('Refreshed admin achievements:', achievements);
                        setAdminAchievements(achievements);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {adminAchievements.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏆</div>
                    <h3 className="text-xl font-bold mb-2">No Achievements Yet</h3>
                    <p className="text-gray-400">Create achievements in the admin panel to see them here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={{
                          id: achievement.id,
                          name: achievement.name,
                          description: achievement.description,
                          icon: achievement.icon || '🏆',
                          xpReward: achievement.xpReward,
                          rarity: achievement.rarity,
                          category: achievement.category,
                          unlocked: false, // This would be determined by user progress
                          blockchainVerified: achievement.blockchainVerified,
                          unlockedAt: undefined,
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    How Achievements Work
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Achievements are created by admins in the admin panel</li>
                    <li>• Each achievement has XP rewards and rarity levels</li>
                    <li>• Blockchain-verified achievements are permanently recorded</li>
                    <li>• Unlocked achievements can mint NFTs as proof</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'NFTs' && (
              <div className="text-center py-8">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-2">NFT Achievement Badges</h3>
                <p className="text-gray-400 mb-4">Your blockchain-verified achievements</p>
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg text-white inline-block">
                  <BlockchainBadge verified={true} size="md" />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Web3 Uniqueness Highlight */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-3">Why EduChain is Different</h3>
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