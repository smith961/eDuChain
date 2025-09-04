import React from "react";

// -------- Types --------
interface MentorOverviewCardProps {
  title: string;
  value: string | number;
  bgColor: string;
}

interface Mentor {
  avatar: string;
  name: string;
}

interface SessionRowProps {
  mentor?: Mentor;
  topic: string;
  date?: string;
  time?: string;
  duration?: string;
  status?: "Scheduled" | "Pending" | "Completed" | string;
  actions?: string[];
}

const MentorOverviewCard: React.FC<MentorOverviewCardProps> = ({ title, value, bgColor }) => (
  <div className={`p-4 rounded-lg ${bgColor}`}>
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const SessionRow: React.FC<SessionRowProps> = ({ mentor, topic, date, time, duration, status, actions }) => (
  <div className="flex items-center justify-between p-3 border-b border-gray-700">
    <div className="flex items-center space-x-3">
      {mentor && <img src={mentor.avatar} alt={mentor.name} className="w-8 h-8 rounded-full" />}
      <div>
        <p className="font-semibold">{mentor ? mentor.name : topic}</p>
        {mentor && <p className="text-sm text-gray-400">{topic}</p>}
        {date && time && <p className="text-sm text-gray-400">{date}, {time}</p>}
      </div>
    </div>
    {duration && <p className="text-sm text-gray-400">{duration}</p>}
    {status && (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded ${
          status === "Scheduled"
            ? "bg-green-600/30 text-green-300"
            : status === "Pending"
            ? "bg-yellow-600/30 text-yellow-300"
            : "bg-gray-600/30 text-gray-300"
        }`}
      >
        {status}
      </span>
    )}
    <div className="flex space-x-2">
      {actions &&
        actions.map((action: string, index: number) => (
          <button
            key={index}
            className={`px-3 py-1 text-sm rounded ${
              action === "Reschedule"
                ? "bg-purple-600/40 text-purple-300"
                : action === "Confirm"
                ? "bg-green-600 text-white"
                : action === "Decline"
                ? "bg-red-600/40 text-red-300"
                : "bg-gray-600/40 text-gray-300"
            }`}
          >
            {action}
          </button>
        ))}
    </div>
  </div>
);

export default function MentorOverView() {
  return (
    <div className="flex-1 p-6 bg-slate-950 text-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        <div className="lg:col-span-2 space-y-6">
        
          <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mentor Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <MentorOverviewCard title="Active Mentees" value={12} bgColor="bg-purple-700/30" />
              <MentorOverviewCard title="Sessions This Week" value={5} bgColor="bg-pink-700/30" />
              <MentorOverviewCard title="Avg. Rating" value={4.9} bgColor="bg-cyan-700/30" />
            </div>
          </div>


          <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sessions</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 rounded-lg bg-purple-600 text-white">Upcoming</button>
                <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300">Past</button>
                <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300">Requests</button>
              </div>
            </div>
            <div className="space-y-2">
              <SessionRow
                mentor={{ avatar: "https://i.pravatar.cc/32?img=1", name: "Sofia Ramirez" }}
                topic="ZK Proofs: Intro"
                date="Sep 10"
                time="2:00 PM"
                duration="45m"
                status="Scheduled"
                actions={["Reschedule"]}
              />
              <SessionRow
                mentor={{ avatar: "https://i.pravatar.cc/32?img=2", name: "Marcus Lee" }}
                topic="Security: Gas Patterns"
                date="Sep 12"
                time="11:00 AM"
                duration="30m"
                status="Scheduled"
                actions={["Reschedule"]}
              />
              <SessionRow
                mentor={{ avatar: "https://i.pravatar.cc/32?img=3", name: "Ana Chen" }}
                topic="Security: Reentrancy"
                date="Sep 13"
                time="4:00 PM"
                duration="60m"
                status="Pending"
                actions={["Confirm", "Decline"]}
              />
            </div>
          </div>

        
          <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mentor Resources</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg flex flex-col items-center">
                <p className="font-semibold mb-1">Session Template</p>
                <p className="text-xs text-gray-400 mb-3">Guided outline for 30/60/90 min sessions.</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">Open</button>
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">Download</button>
                </div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg flex flex-col items-center">
                <p className="font-semibold mb-1">Feedback Rubric</p>
                <p className="text-xs text-gray-400 mb-3">Consistent scoring for mentee submissions.</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">Use</button>
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">Download</button>
                </div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg flex flex-col items-center">
                <p className="font-semibold mb-1">Office Hours Guide</p>
                <p className="text-xs text-gray-400 mb-3">Best practices to host high-signal office hours.</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">Schedule</button>
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Your Availability */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Availability</h2>
            <div className="mb-3">
              <p className="text-sm text-gray-400">Weekly Slots</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold">5</p>
                <button className="text-purple-400 text-sm">Edit</button>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-400">Time Zone</p>
              <p className="font-semibold">UTC-5</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Notifications</p>
              <p className="font-semibold">On</p>
            </div>
          </div>

          {/* Mentorship Requests */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mentorship Requests</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="https://i.pravatar.cc/32?img=4" alt="Priya N." className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold">Priya N.</p>
                    <p className="text-sm text-gray-400">Topic: Auditing Basics</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-green-600 text-white">Accept</button>
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">Suggest Time</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="https://i.pravatar.cc/32?img=5" alt="Yuta S." className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold">Yuta S.</p>
                    <p className="text-sm text-gray-400">Topic: ZK Circuits</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-green-600 text-white">Accept</button>
                  <button className="px-3 py-1 text-sm rounded bg-gray-600/40 text-gray-300">Suggest Time</button>
                </div>
              </div>
            </div>
          </div>

          {/* Reputation */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Reputation</h2>
            <div className="mb-3">
              <p className="text-sm text-gray-400">Mentor Level</p>
              <span className="px-3 py-1 text-sm rounded-full bg-yellow-600/30 text-yellow-300 font-semibold">
                Gold
              </span>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-400">Total XP Awarded</p>
              <p className="font-semibold">24,300</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Verified Credentials</p>
              <p className="font-semibold">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
