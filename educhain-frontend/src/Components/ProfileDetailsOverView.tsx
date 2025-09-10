import React, { useState, useEffect } from 'react'; // Import useState
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { suiClient, getUserProfile, updateUserProfile, getUserAchievements, getUserNFTs } from '../services/blockchainService';
import { useAuth } from '../contexts/AuthContext';
import XPService from '../services/xpService';


function ProfileHeader() {
    const account = useCurrentAccount();
    const [blockchainProfile, setBlockchainProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlockchainProfile = async () => {
            if (account?.address) {
                try {
                    const profile = await getUserProfile(account.address);
                    setBlockchainProfile(profile);
                } catch (error) {
                    console.error('Error loading blockchain profile:', error);
                }
            }
            setLoading(false);
        };

        loadBlockchainProfile();
    }, [account?.address]);

    if (loading) {
        return (
            <div className="flex items-center justify-center mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="ml-2 text-gray-400">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                <div className="w-16 h-16 rounded-full mr-4 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                  👶
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        {blockchainProfile?.username || 'Blockchain User'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {blockchainProfile?.email || 'user@educhain.io'}
                    </p>
                    <div className="flex items-center mt-1">
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded text-white mr-2">
                            Level {blockchainProfile?.current_level || 1}
                        </span>
                        <span className="text-xs text-gray-500">
                            {blockchainProfile?.total_xp || 0} XP
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Edit Profile</button>
                <button
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm"
                    onClick={() => {
                        if (account?.address) {
                            navigator.clipboard.writeText(account.address);
                            alert('Wallet address copied to clipboard!');
                        }
                    }}
                >
                    Copy DID
                </button>
            </div>
        </div>
    );
}

function ProfileDetails() {
    const account = useCurrentAccount();
    const { user } = useAuth();
    const [blockchainProfile, setBlockchainProfile] = useState<any>(null);
    const [profile, setProfile] = useState({
        displayName: '',
        username: '',
        email: '',
        wallet: '',
        role: 'Learner',
        location: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfileData = async () => {
            if (account?.address) {
                try {
                    const bcProfile = await getUserProfile(account.address);
                    setBlockchainProfile(bcProfile);

                    // Set form data from blockchain
                    setProfile({
                        displayName: bcProfile.username || '',
                        username: `@${bcProfile.username?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
                        email: bcProfile.email || '',
                        wallet: `${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
                        role: 'Learner',
                        location: '',
                    });
                } catch (error) {
                    console.error('Error loading profile:', error);
                }
            }
            setLoading(false);
        };

        loadProfileData();
    }, [account?.address]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        if (!account?.address) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            setSaving(true);

            // Update profile on blockchain
            const updates = {
                username: profile.displayName,
                email: profile.email,
            };

            await updateUserProfile(updates);

            // Update local state
            setBlockchainProfile({
                ...blockchainProfile,
                username: profile.displayName,
                email: profile.email,
            });

            alert("Profile updated successfully on blockchain!");
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="ml-2 text-gray-400">Loading profile data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <label className="block text-gray-400 mb-1">Display Name</label>
                    <input
                        type="text"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your display name"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Wallet Address</label>
                    <input
                        type="text"
                        name="wallet"
                        value={profile.wallet}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Connected wallet address</p>
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Role</label>
                    <input
                        type="text"
                        name="role"
                        value={profile.role}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your role (Learner/Instructor)"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your location"
                    />
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Changes are saved to the blockchain
                </div>
                <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className={`px-6 py-2 rounded-md font-semibold ${
                        saving
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors`}
                >
                    {saving ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                        </div>
                    ) : (
                        'Save to Blockchain'
                    )}
                </button>
            </div>
        </div>
    );
}

type ProgressBarProps = {
    label: string;
    percentage: number;
};

function XPProgress() {
    const account = useCurrentAccount();
    const [blockchainProfile, setBlockchainProfile] = useState<any>(null);
    const [userXP, setUserXP] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadXPData = async () => {
            if (account?.address) {
                try {
                    const profile = await getUserProfile(account.address);
                    const xpData = await XPService.getUserXP(account.address);
                    setBlockchainProfile(profile);
                    setUserXP(xpData);
                } catch (error) {
                    console.error('Error loading XP data:', error);
                }
            }
            setLoading(false);
        };

        loadXPData();
    }, [account?.address]);

    const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage }) => (
        <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-white">{label}</span>
                <span className="text-gray-400">{percentage}% complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="ml-2 text-gray-400">Loading XP data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">XP & Progress</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-400 text-sm">Total XP</p>
                    <p className="text-white text-2xl font-bold">
                        {userXP?.totalXP?.toLocaleString() || blockchainProfile?.total_xp?.toLocaleString() || '0'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Current Level</p>
                    <p className="text-white text-2xl font-bold">
                        {userXP?.currentLevel || blockchainProfile?.current_level || 1}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-400 text-sm">Login Streak</p>
                    <p className="text-white text-lg font-bold">
                        {blockchainProfile?.login_streak || 0} days
                    </p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Courses Completed</p>
                    <p className="text-white text-lg font-bold">
                        {blockchainProfile?.courses_enrolled || 0}
                    </p>
                </div>
            </div>
            <h4 className="text-md font-semibold text-white mb-3">Learning Progress</h4>
            <ProgressBar label="Lessons Completed" percentage={Math.min((blockchainProfile?.lessons_completed || 0) * 10, 100)} />
            <ProgressBar label="Courses Enrolled" percentage={Math.min((blockchainProfile?.courses_enrolled || 0) * 25, 100)} />
            <ProgressBar label="Overall Progress" percentage={Math.min((blockchainProfile?.total_xp || 0) / 10, 100)} />
        </div>
    );
}

function LinkedAccounts() {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Linked Accounts</h3>
            <div className="space-y-3">
                
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="text-white">OAuth</p>
                </div>
            
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="text-white">Web3</p>
                </div>
            
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="text-white">GitHub</p>
                    <p className="text-gray-400 text-sm">sofia-dev</p>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="text-white">Twitter/X</p>
                    <p className="text-gray-400 text-sm">@sofiar</p>
                </div>
            </div>
            <div className="flex justify-end mt-6 space-x-4"> {/* Adjusted spacing and justification */}
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md font-semibold text-sm">
                    Connect Wallet
                </button>
                <button className="text-white py-2 px-4 rounded-md font-semibold text-sm hover:bg-gray-700 border border-gray-700"> {/* Transparent button */}
                    Disconnect
                </button>
            </div>
        </div>
    );
}


function VerifiableCredentials() {
    const account = useCurrentAccount();
    const [achievements, setAchievements] = useState<any[]>([]);
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCredentials = async () => {
            if (account?.address) {
                try {
                    const userAchievements = await getUserAchievements(account.address);
                    const userNFTs = await getUserNFTs(account.address);
                    setAchievements(userAchievements);
                    setNfts(userNFTs);
                } catch (error) {
                    console.error('Error loading credentials:', error);
                }
            }
            setLoading(false);
        };

        loadCredentials();
    }, [account?.address]);

    if (loading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="ml-2 text-gray-400">Loading credentials...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Blockchain Credentials</h3>

            {/* Achievements */}
            {achievements.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-white mb-3">🏆 Achievements</h4>
                    {achievements.filter(a => a.unlocked).map((achievement) => (
                        <div key={achievement.id} className="bg-gray-700 p-4 rounded-md mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white font-medium">{achievement.name}</p>
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Verified
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Earned {new Date(achievement.unlockedAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs bg-blue-600 px-2 py-1 rounded text-white">
                                    +{achievement.xpReward} XP
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NFTs */}
            {nfts.length > 0 && (
                <div>
                    <h4 className="text-md font-semibold text-white mb-3">🎨 NFTs</h4>
                    {nfts.map((nft) => (
                        <div key={nft.id} className="bg-gray-700 p-4 rounded-md mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white font-medium">{nft.name}</p>
                                <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                    nft.rarity === 'legendary' ? 'bg-purple-600' :
                                    nft.rarity === 'epic' ? 'bg-orange-600' :
                                    nft.rarity === 'rare' ? 'bg-blue-600' : 'bg-gray-600'
                                } text-white`}>
                                    {nft.rarity.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{nft.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Minted {new Date(nft.mintedAt).toLocaleDateString()}
                                </span>
                                <div className="flex space-x-2">
                                    <button className="bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded-md text-xs">View</button>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-md text-xs">Transfer</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {achievements.length === 0 && nfts.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏆</div>
                    <p className="text-gray-400">No blockchain credentials yet</p>
                    <p className="text-sm text-gray-500 mt-2">Complete courses and earn achievements to get NFTs!</p>
                </div>
            )}
        </div>
    );
}

function SecuritySessions() {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Security & Sessions</h3>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Enabled</span>
                </div>
                <p className="text-gray-400 text-sm">Authenticator app</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Active Sessions</p>
                    <span className="text-gray-400">3 devices</span>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md text-sm">Review</button>
                    <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm">Sign out all</button>
                </div>
            </div>
        </div>
    );
}

export default function ProfileDetailsOverView() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <ProfileHeader />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ProfileDetails />
                        <XPProgress />
                        <LinkedAccounts />
                    </div>
                    <div className="lg:col-span-1">
                        <VerifiableCredentials />
                        <SecuritySessions />
                    </div>
                </div>
            </div>
        </div>
    );
}