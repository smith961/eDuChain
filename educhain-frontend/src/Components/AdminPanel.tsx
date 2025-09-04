import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Users");

  const tabs = ["Users", "Courses", "Credentials", "Reports"];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Courses") {
      navigate("/courses"); // navigate only when Courses tab is clicked
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      {/* Header - Admin Overview & System Health */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Admin Overview</h2>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>Last 7 days</span>
              <button className="text-emerald-400 hover:text-emerald-300">
                Refresh
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-md p-4">
              <p className="text-gray-400 text-sm">Active Learners</p>
              <p className="text-2xl font-bold">4,120</p>
            </div>
            {/* Removed onClick here */}
            <div className="bg-slate-800 rounded-md p-4 cursor-pointer hover:bg-slate-700 transition">
              <p className="text-gray-400 text-sm">Courses Live</p>
              <p className="text-2xl font-bold text-blue-400">36</p>
            </div>
            <div className="bg-slate-800 rounded-md p-4">
              <p className="text-gray-400 text-sm">XP Minted</p>
              <p className="text-2xl font-bold">1.2M</p>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Mint Success Rate</p>
              <p className="text-lg font-semibold text-emerald-400">99.2%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Tx Pending</p>
              <p className="text-lg font-semibold">3</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Queue Size</p>
              <p className="text-lg font-semibold">18</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Users Table */}
        <div className="col-span-2 bg-gray-900 rounded-lg p-6">
          <div className="flex space-x-4 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-2 text-gray-400">User</th>
                <th className="py-3 px-2 text-gray-400">Role</th>
                <th className="py-3 px-2 text-gray-400">XP</th>
                <th className="py-3 px-2 text-gray-400">Status</th>
                <th className="py-3 px-2 text-gray-400">Last Active</th>
                <th className="py-3 px-2 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Example row */}
              <tr className="border-b border-gray-800">
                <td className="py-4 px-2 flex items-center">
                  <img
                    src="https://via.placeholder.com/24"
                    alt="Ana Chen"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-medium">Ana Chen</p>
                    <p className="text-gray-500 text-xs">ana.chen@educhain.io</p>
                  </div>
                </td>
                <td className="py-4 px-2">Learner</td>
                <td className="py-4 px-2">3,450</td>
                <td className="py-4 px-2">
                  <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    Verified
                  </span>
                </td>
                <td className="py-4 px-2 text-gray-400">2h ago</td>
                <td className="py-4 px-2 space-x-2">
                  <button className="bg-emerald-700 text-white text-xs px-3 py-1 rounded-md hover:bg-emerald-600">
                    Promote
                  </button>
                  <button className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-md hover:bg-gray-600">
                    Suspend
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Moderation Queue */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Moderation Queue</h2>
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-md p-4 flex items-start space-x-3">
              <img
                src="https://via.placeholder.com/32"
                alt="Priya N."
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">
                  Priya N. <span className="text-red-500 text-xs ml-2">High</span>
                </p>
                <p className="text-gray-400 text-sm">Post flagged: Giveaway link</p>
                <div className="mt-2 space-x-2">
                  <button className="bg-emerald-700 text-white text-xs px-3 py-1 rounded-md hover:bg-emerald-600">
                    Approve
                  </button>
                  <button className="bg-red-700 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600">
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-md p-4 flex items-start space-x-3">
              <img
                src="https://via.placeholder.com/32"
                alt="Yuta S."
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">
                  Yuta S. <span className="text-yellow-500 text-xs ml-2">Medium</span>
                </p>
                <p className="text-gray-400 text-sm">Username report: spam</p>
                <div className="mt-2 space-x-2">
                  <button className="bg-orange-700 text-white text-xs px-3 py-1 rounded-md hover:bg-orange-600">
                    Warn
                  </button>
                  <button className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-md hover:bg-gray-600">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Mint & Issue Credentials & Release Controls */}
      {/* ...keep your existing footer code */}
    </div>
  );
}
