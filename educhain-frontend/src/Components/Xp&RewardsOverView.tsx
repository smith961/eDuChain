import React from 'react';

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


export default function XpAndRewards() {
  const [activeTab, setActiveTab] = React.useState('Overview');

  const xpActivity = [
    { source: 'Solidity Basics: Module 4', date: 'Sep 2', xp: '+220', status: 'Confirmed', action: 'Details' },
    { source: 'Weekly Streak', date: 'Aug 31', xp: '+50', status: 'Confirmed', action: 'Details' },
    { source: 'Mentor Review Bonus', date: 'Aug 29', xp: '+120', status: 'Pending', action: 'Claim' },
  ];

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


  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-sans flex flex-col lg:flex-row gap-6">
      {/* Main Content Area */}
      <div className="flex-grow grid grid-cols-1 gap-6">
        {/* XP & Rewards Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">XP & Rewards</h1>
          <p className="text-gray-400 text-md">Track XP earnings, claim credentials, and redeem perks.</p>
        </div>

        {/* XP & Rewards Overview */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <div className="flex border-b border-slate-700 pb-2 mb-4">
            <TabButton isActive={activeTab === 'Overview'} onClick={handleTabClick('Overview')}>Overview</TabButton>
            <TabButton isActive={activeTab === 'Earnings'} onClick={handleTabClick('Earnings')}>Earnings</TabButton>
            <TabButton isActive={activeTab === 'Redemptions'} onClick={handleTabClick('Redemptions')}>Redemptions</TabButton>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Total XP</p>
              <p className="text-3xl font-bold text-green-400">2,640</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available XP</p>
              <p className="text-3xl font-bold text-white">1,980</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Credentials</p>
              <p className="text-3xl font-bold text-white">3 minted</p>
            </div>
          </div>
        </div>

        {/* Recent XP Activity */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">Recent XP Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-2 px-4 font-semibold">Source</th>
                  <th className="py-2 px-4 font-semibold">Date</th>
                  <th className="py-2 px-4 font-semibold">XP</th>
                  <th className="py-2 px-4 font-semibold">Status</th>
                  <th className="py-2 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {xpActivity.map((activity, index) => (
                  <tr key={index} className="border-b border-slate-700 last:border-b-0">
                    <td className="py-3 px-4">{activity.source}</td>
                    <td className="py-3 px-4 text-gray-400">{activity.date}</td>
                    <td className="py-3 px-4 text-green-400 font-medium">{activity.xp}</td>
                    <td className="py-3 px-4">{activity.status}</td>
                    <td className="py-3 px-4">
                      {activity.action === 'Claim' ? (
                        <PrimaryButton onClick={handleClaimClick(activity.source)} className="py-1 px-3 text-sm">Claim</PrimaryButton>
                      ) : (
                        <DetailButton onClick={handleDetailsClick(activity.source)} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Credential Wallet */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">Credential Wallet</h2>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-sm">Sort: Latest</p>
            {/* Could add a dropdown here for sorting */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CredentialCard
              title="Credential: Web3 Fundamentals"
              status="Minted"
              description="On-chain badge for completing Milestone 1,"
              id="#0xF1A2"
              onClickView={handleViewCredential('#0xF1A2')}
            />
            <CredentialCard
              title="Credential: Ethereum Basics"
              status="Minted"
              description="Proof of completion with score 92%."
              id="#0x8833"
              onClickView={handleViewCredential('#0x8833')}
            />
            <div className="bg-slate-700 p-4 rounded-lg shadow-sm flex flex-col items-start text-white w-full">
              <h3 className="font-semibold text-lg mb-2">Credential: Smart Contract Security</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-600 text-black mb-3">Eligible</span>
              <p className="text-gray-400 text-sm mb-4">Complete the course to mint.</p>
              <div className="w-full bg-slate-600 rounded-full h-2.5 mb-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-gray-400 text-xs mb-3">Req: 80%*</p>
              <PrimaryButton onClick={handlePreviewSmartContractSecurity} className="w-full">Preview</PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Redeem Center, Featured Rewards, Streak & Boosts */}
      <div className="w-full lg:w-96 flex-shrink-0 grid grid-cols-1 gap-6">
        {/* Redeem Center */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">Redeem Center</h2>
          <div className="mb-4">
            <label htmlFor="reward-select" className="block text-gray-400 text-sm mb-2">Choose Reward</label>
            <select
              id="reward-select"
              className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select an option</option>
              <option>NFT Badge: Smart Contracts</option>
              <option>Merch Voucher</option>
              <option>Mentor 1:1 Session</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="amount-input" className="block text-gray-400 text-sm mb-2">Amount: 500 XP</label>
            <input
              id="amount-input"
              type="number"
              value="500"
              readOnly
              className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <PrimaryButton onClick={handleRedeemClick} className="w-full mb-2">Redeem</PrimaryButton>
          <p className="text-gray-400 text-sm">XP available: 1,980</p>
        </div>

        {/* Featured Rewards */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">Featured Rewards</h2>
          <div className="mb-4">
            <p className="font-semibold">NFT Badge: Smart Contracts</p>
            <p className="text-gray-400 text-sm mb-2">Cost: 800 XP</p>
            <DetailButton onClick={handleDetailsClick('NFT Badge: Smart Contracts')} />
          </div>
          <div className="mb-4">
            <p className="font-semibold">Merch Voucher</p>
            <p className="text-gray-400 text-sm mb-2">Cost: 1200 XP</p>
            <DetailButton onClick={handleDetailsClick('Merch Voucher')} />
          </div>
          <div>
            <p className="font-semibold">Mentor 1:1 Session</p>
            <p className="text-gray-400 text-sm mb-2">Cost: 1500 XP</p>
            <DetailButton onClick={handleDetailsClick('Mentor 1:1 Session')} />
          </div>
        </div>

        {/* Streak & Boosts */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">Streak & Boosts</h2>
          <div className="mb-4">
            <p className="font-semibold mb-2">Weekly Streak</p>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div>
            <p className="font-semibold">XP Boost</p>
            <p className="text-gray-400 text-sm mb-2">+15% XP active this week</p>
            <DetailButton onClick={handleDetailsClick('XP Boost')} />
          </div>
        </div>
      </div>
    </div>
  );
}