export default function Community() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans flex">
            
            <div className="flex-1 mr-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6">Mentor Overview</h1>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-800 p-5 rounded-lg shadow">
                            <p className="text-gray-400 text-sm">Active Mentees</p>
                            <p className="text-3xl font-bold">12</p>
                        </div>
                        <div className="bg-gray-800 p-5 rounded-lg shadow">
                            <p className="text-gray-400 text-sm">Sessions This Week</p>
                            <p className="text-3xl font-bold">5</p>
                        </div>
                        <div className="bg-gray-800 p-5 rounded-lg shadow">
                            <p className="text-gray-400 text-sm">Avg. Rating</p>
                            <p className="text-3xl font-bold">4.9</p>
                        </div>
                    </div>

    
                    <div className="bg-gray-800 p-6 rounded-lg shadow">
                        <div className="flex border-b border-gray-700 mb-4">
                            <button className="px-6 py-3 text-green-400 border-b-2 border-green-400 -mb-px">Upcoming</button>
                            <button className="px-6 py-3 text-gray-400">Past</button>
                            <button className="px-6 py-3 text-gray-400">Requests</button>
                        </div>

                    
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-gray-400 text-sm uppercase text-left">
                                        <th className="py-3 pr-4">Session</th>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Duration</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 pl-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-700 last:border-b-0">
                                        <td className="py-4 pr-4 flex items-center">
                                            <div className="w-9 h-9 rounded-full mr-3 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-sm">👶</div>
                                            <div>
                                                <p className="font-semibold">Sofia Ramirez</p>
                                                <p className="text-gray-400 text-sm">ZK Proofs: Intro</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">Sep 10, <br /> 2:00 PM</td>
                                        <td className="py-4 px-4">45m</td>
                                        <td className="py-4 px-4 text-green-400">Scheduled</td>
                                        <td className="py-4 pl-4">
                                            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Reschedule</button>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-700 last:border-b-0">
                                        <td className="py-4 pr-4 flex items-center">
                                            <div className="w-9 h-9 rounded-full mr-3 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm">👶</div>
                                            <div>
                                                <p className="font-semibold">Marcus Lee</p>
                                                <p className="text-gray-400 text-sm">Security: Gas Fusions</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">Sep 12, <br /> 11:00 AM</td>
                                        <td className="py-4 px-4">30m</td>
                                        <td className="py-4 px-4 text-green-400">Scheduled</td>
                                        <td className="py-4 pl-4">
                                            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Reschedule</button>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-700 last:border-b-0">
                                        <td className="py-4 pr-4 flex items-center">
                                            <div className="w-9 h-9 rounded-full mr-3 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm">👶</div>
                                            <div>
                                                <p className="font-semibold">Ana Chen</p>
                                                <p className="text-gray-400 text-sm">Security: Reentrancy</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">Sep 13, <br /> 4:00 PM</td>
                                        <td className="py-4 px-4 text-yellow-400">Pending</td>
                                        <td className="py-4 pl-4 flex space-x-2">
                                            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm">Confirm</button>
                                            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm">Decline</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Mentor Resources</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-5 rounded-lg shadow">
                            <p className="text-lg font-semibold mb-1">Session Template</p>
                            <p className="text-gray-400 text-sm mb-3">Guided outline for 30/60/90 min sessions.</p>
                            <div className="flex space-x-2">
                                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Open</button>
                                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Download</button>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-5 rounded-lg shadow">
                            <p className="text-lg font-semibold mb-1">Feedback Rubric</p>
                            <p className="text-gray-400 text-sm mb-3">Consistent scoring for mentee submissions.</p>
                            <div className="flex space-x-2">
                                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Use</button>
                                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Download</button>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-5 rounded-lg shadow">
                            <p className="text-lg font-semibold mb-1">Office Hours Guide</p>
                            <p className="text-gray-400 text-sm mb-3">Best practices to host high-signal office hours.</p>
                            <div className="flex space-x-2">
                                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">Schedule</button>
                                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm">View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="w-80 space-y-8">
                
                <div className="bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Your Availability</h2>
                        <button className="text-green-400 text-sm">Edit</button>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">Weekly Slots</p>
                    <p className="text-lg font-semibold">5</p>
                    <p className="text-gray-400 text-sm mt-4 mb-2">Time Zone</p>
                    <p className="text-lg font-semibold">UTC-5</p>
                    <p className="text-gray-400 text-sm mt-4 mb-2">Notifications</p>
                    <p className="text-lg font-semibold">On</p>
                </div>

            
                <div className="bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Mentorship Requests</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full mr-3 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-lg">👶</div>
                                <div>
                                    <p className="font-semibold">Priya N.</p>
                                    <p className="text-gray-400 text-sm">Topic: Auditing Basics</p>
                                </div>
                            </div>
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                        </div>
                        <div className="flex space-x-2">
                            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm flex-1">Accept</button>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm flex-1">Suggest Time</button>
                        </div>
                        <div className="border-t border-gray-700 pt-4"></div> {/* Divider */}

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full mr-3 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg">👶</div>
                                <div>
                                    <p className="font-semibold">Yuta S.</p>
                                    <p className="text-gray-400 text-sm">Topic: ZK Circuits</p>
                                </div>
                            </div>
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                        </div>
                        <div className="flex space-x-2">
                            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm flex-1">Accept</button>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm flex-1">Suggest Time</button>
                        </div>
                    </div>
                </div>

            
                <div className="bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Reputation</h2>
                    <p className="text-gray-400 text-sm mb-2">Mentor Level</p>
                    <div className="flex items-center mb-4">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-2">Gold</span>
                        <div className="flex-1 h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-green-500 rounded-full w-[80%]"></div> {/* Example progress */}
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">Total XP Awarded</p>
                    <p className="text-lg font-semibold mb-4">24,300</p>
                    <p className="text-gray-400 text-sm mb-2">Verified Credentials</p>
                    <p className="text-lg font-semibold">3</p>
                </div>
            </div>
        </div>
    );
}