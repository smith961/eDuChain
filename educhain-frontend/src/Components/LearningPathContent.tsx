import { Avatar } from "@radix-ui/themes";
import { FaEye, FaGraduationCap } from "react-icons/fa";

export function LearningPathContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    
        <div className="lg:col-span-3 space-y-6">
        
          <div className="bg-slate-900 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">Welcome back, Learner</h1>
            <p className="text-slate-400 mb-6">Track your progress and continue your path</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">3,420</div>
                <div className="text-sm text-slate-400">Total Points</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">4</div>
                <div className="text-sm text-slate-400">Courses Active</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">7</div>
                <div className="text-sm text-slate-400">Completed</div>
              </div>
            </div>
          </div>

  
          <div className="bg-slate-900 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
              <h2 className="text-xl font-semibold">In Progress</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <select className="bg-slate-800 text-white px-3 py-1 rounded text-sm w-full sm:w-auto">
                  <option>Sort: Recent</option>
                </select>
                <select className="bg-slate-800 text-white px-3 py-1 rounded text-sm w-full sm:w-auto">
                  <option>Level: Any</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <h3 className="font-medium">Solidity Basics</h3>
                  <div className="w-full sm:w-48 bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <h3 className="font-medium">DeFi Risk Management</h3>
                  <div className="w-full sm:w-48 bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <h3 className="font-medium">NFT Economics</h3>
                  <div className="w-full sm:w-48 bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800 rounded-lg gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-green-400" />
                <span>Buy New Program</span>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 w-full sm:w-auto">
                View Achievements
              </button>
            </div>
          </div>

        
          <div className="bg-slate-900 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
              <h2 className="text-xl font-semibold">Recommended For You</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <select className="bg-slate-800 text-white px-3 py-1 rounded text-sm w-full sm:w-auto">
                  <option>Category: All</option>
                </select>
                <select className="bg-slate-800 text-white px-3 py-1 rounded text-sm w-full sm:w-auto">
                  <option>Difficulty</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dkrpginfm/image/upload/v1756934338/error1_bltjoq.png"
                  alt="Smart Contracts 101"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">Smart Contracts 101</h3>
                  <p className="text-sm text-slate-400 mb-3">Beginner • 2h</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 bg-slate-700 text-white px-3 py-2 rounded text-sm hover:bg-slate-600">
                      <FaEye className="inline mr-1" /> Preview
                    </button>
                    <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dkrpginfm/image/upload/v1756934671/error2_ivycq0.png"
                  alt="Advanced Solidity Patterns"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">Advanced Solidity Patterns</h3>
                  <p className="text-sm text-slate-400 mb-3">Advanced • 4h</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 bg-slate-700 text-white px-3 py-2 rounded text-sm hover:bg-slate-600">
                      <FaEye className="inline mr-1" /> Preview
                    </button>
                    <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                      Purchase
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dkrpginfm/image/upload/v1756934786/error3_oeaoe1.png"
                  alt="DeFi Mechanics"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">DeFi Mechanics</h3>
                  <p className="text-sm text-slate-400 mb-3">Beginner • 3h</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 bg-slate-700 text-white px-3 py-2 rounded text-sm hover:bg-slate-600">
                      <FaEye className="inline mr-1" /> Preview
                    </button>
                    <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dkrpginfm/image/upload/v1756935293/error4_tsjoqa.png"
                  alt="DAO Governance"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">DAO Governance</h3>
                  <p className="text-sm text-slate-400 mb-3">Advanced • 5h</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 bg-slate-700 text-white px-3 py-2 rounded text-sm hover:bg-slate-600">
                      <FaEye className="inline mr-1" /> Preview
                    </button>
                    <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Your Wallet & Rewards</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">XP Balance</span>
                <span className="font-semibold">5,420 XP</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Connected Wallet</span>
                <span className="text-red-400">Not connected</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Redeem Options</span>
                <button className="text-green-400 hover:text-green-300">View</button>
              </div>
            </div>
          </div>

      
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Leaderboard</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">1</span>
                <Avatar size="2" fallback="AK" />
                <div className="flex-1">
                  <div className="font-medium">Alex Kim</div>
                </div>
                <span className="text-sm">5,980 XP</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold">2</span>
                <Avatar size="2" fallback="RS" />
                <div className="flex-1">
                  <div className="font-medium">Riya Sen</div>
                </div>
                <span className="text-sm">5,430 XP</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-orange-400 font-bold">3</span>
                <Avatar size="2" fallback="DM" />
                <div className="flex-1">
                  <div className="font-medium">Diego M.</div>
                </div>
                <span className="text-sm">5,110 XP</span>
              </div>
            </div>
          </div>

  
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-3 text-sm">
              <div className="text-slate-300">New course "Zero-Knowledge Proofs" is now live.</div>
              <div className="text-slate-300">You earned the "Streak x7" badge! +200 XP</div>
              <div className="text-slate-300">Community AMA with Dr. Lin tomorrow 5 PM UTC.</div>
            </div>
          </div>

    
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Achievements</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Smart Contract Master</span>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">Quiz Master</span>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs">Early Bird</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}