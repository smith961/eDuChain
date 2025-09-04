import React, { useState } from 'react'; // Import useState
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';


function ProfileHeader() {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                <img className="w-16 h-16 rounded-full mr-4" src="https://res.cloudinary.com/dkrpginfm/image/upload/v1756943015/alex-kim_lme9qf.jpg" alt="Sofia Ramirez" />
                <div>
                    <h2 className="text-xl font-semibold text-white">Sofia Ramirez</h2>
                    <p className="text-gray-400 text-sm">sofia@educhain.io</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Edit Profile</button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Copy DID</button>
            </div>
        </div>
    );
}

function ProfileDetails() {
    
    const [profile, setProfile] = useState({
        displayName: 'Sofia Ramirez',
        username: '@sofiar',
        email: 'sofia@educhain.io',
        wallet: '0x92c4...fA12',
        role: 'Learner',
        location: 'Mexico City, MX',
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        
        console.log("Saving changes:", profile);
        alert("Profile changes saved! (Check console for data)");
    };

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
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Wallet</label>
                    <input
                        type="text"
                        name="wallet"
                        value={profile.wallet}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Role</label>
                    <input
                        type="text"
                        name="role"
                        value={profile.role}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    />
                </div>
            </div>
            <button
                onClick={handleSaveChanges}
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold"
            >
                Save Changes
            </button>
        </div>
    );
}

type ProgressBarProps = {
    label: string;
    percentage: number;
};

function XPProgress() {
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

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">XP & Progress</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-400 text-sm">Total XP</p>
                    <p className="text-white text-2xl font-bold">12,980</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Streak</p>
                    <p className="text-white text-2xl font-bold">21 days</p>
                </div>
            </div>
            <h4 className="text-md font-semibold text-white mb-3">Current Courses</h4>
            <ProgressBar label="Solidity Fundamentals" percentage={68} />
            <ProgressBar label="DeFi Primitives" percentage={34} />
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
    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Verifiable Credentials</h3>
            <div className="bg-gray-700 p-4 rounded-md mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Solidity Fundamentals</p>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Verified
                    </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">Issued by EduChain • Standard: Open Badges</p>
                <div className="flex space-x-2">
                    <button className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md text-sm">View</button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm">Mint to Wallet</button>
                </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Onchain Learner Level 1</p>
                    <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">Pending</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">Awaiting mentor approval</p>
                <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm">Request Review</button>
                    <button className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md text-sm">Share</button>
                </div>
            </div>
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