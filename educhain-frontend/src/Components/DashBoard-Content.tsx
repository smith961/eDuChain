import { Avatar, Button, Card, Progress } from "@radix-ui/themes"
import { FaShare, FaCheck } from "react-icons/fa"

export function DashboardContent() {
  return (
    <div className="flex-1 p-6 bg-slate-950 overflow-y-auto">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        <div className="xl:col-span-3 space-y-6">
        
          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="mb-4">
              <h2 className="text-white text-xl font-semibold mb-2">Dashboard Overview</h2>
              <p className="text-gray-400 text-sm">Deep dive into your learning and XP performance.</p>
            </div>

  
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">This Week XP</p>
                <p className="text-3xl font-bold text-white">+520</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Courses In Progress</p>
                <p className="text-3xl font-bold text-white">4</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Certifications</p>
                <p className="text-3xl font-bold text-white">2</p>
              </div>
            </div>

        
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Continue Learning</h3>
                <div className="flex space-x-3">
                  <select className="bg-slate-800 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:border-slate-500">
                    <option>Sort: Recent</option>
                  </select>
                  <select className="bg-slate-800 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:border-slate-500">
                    <option>Level: Any</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <span className="text-white font-medium">Solidity Basics</span>
                  <div className="w-40">
                    <Progress value={85} className="h-2" color="green" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <span className="text-white font-medium">DeFi Risk Management</span>
                  <div className="w-40">
                    <Progress value={45} className="h-2" color="green" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <span className="text-white font-medium">NFT Economics</span>
                  <div className="w-40">
                    <Progress value={70} className="h-2" color="green" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">XP Activity</h2>
              <div className="flex space-x-3">
                <select className="bg-slate-800 text-white text-sm px-3 py-2 rounded border border-slate-600">
                  <option>Range: 30d</option>
                </select>
                <select className="bg-slate-800 text-white text-sm px-3 py-2 rounded border border-slate-600">
                  <option>Type: All</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">+120 XP • Completed quiz in Smart Contracts 101</p>
                </div>
                <span className="text-gray-400 text-sm">Today</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">+200 XP • 7-day streak achieved</p>
                </div>
                <span className="text-gray-400 text-sm">Yesterday</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">-300 XP • Redeemed for Advanced Solidity Patterns</p>
                </div>
                <span className="text-gray-400 text-sm">2d ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">+80 XP • Watched DeFi Mechanics module</p>
                </div>
                <span className="text-gray-400 text-sm">3d ago</span>
              </div>
            </div>
          </Card>

          
          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Certificates & Credentials</h2>
              <select className="bg-slate-800 text-white text-sm px-3 py-2 rounded border border-slate-600">
                <option>Sort: Recent</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded opacity-20"></div>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">Smart Contract Novice</h4>
                <p className="text-gray-400 text-xs mb-3">Verifiable • Issued May 2025</p>
                <div className="flex space-x-2">
                  <Button size="1" variant="outline" className="text-xs flex-1 bg-transparent">
                    <FaShare className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="1" className="text-xs bg-green-500 hover:bg-green-600 px-3">
                    <FaCheck className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg mx-auto mb-3"></div>
                <h4 className="text-white font-semibold text-sm mb-1">DeFi Practitioner</h4>
                <p className="text-gray-400 text-xs mb-3">Verifiable • Issued Mar 2025</p>
                <div className="flex space-x-2">
                  <Button size="1" variant="outline" className="text-xs flex-1 bg-transparent">
                    <FaShare className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="1" className="text-xs bg-green-500 hover:bg-green-600">
                    Verify
                  </Button>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full border-2 border-yellow-200"></div>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">DAO Governance Expert</h4>
                <p className="text-gray-400 text-xs mb-3">Verifiable • Issued Jan 2025</p>
                <div className="flex space-x-2">
                  <Button size="1" variant="outline" className="text-xs flex-1 bg-transparent">
                    <FaShare className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="1" className="text-xs bg-green-500 hover:bg-green-600">
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        
        <div className="xl:col-span-1 space-y-6">
      
          <Card className="bg-slate-900 border-slate-700 p-4">
            <h2 className="text-white text-lg font-semibold mb-4">Daily Goals</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-white">Complete 1 quiz</span>
                <span className="text-green-400 text-sm font-medium">+50 XP</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-white">Learn 20 min</span>
                <span className="text-green-400 text-sm font-medium">+30 XP</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-white">Streak: Keep 8 days</span>
                <span className="text-green-400 text-sm font-medium">+100 XP</span>
              </div>
            </div>
          </Card>

        
          <Card className="bg-slate-900 border-slate-700 p-4">
            <h2 className="text-white text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Connect Wallet</span>
                <Button size="1" variant="outline">
                  Connect
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Redeem XP</span>
                <Button size="1" className="bg-green-500 hover:bg-green-600 text-white">
                  Open
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Invite a friend</span>
                <Button size="1" variant="outline">
                  Invite
                </Button>
              </div>
            </div>
          </Card>

      
          <Card className="bg-slate-900 border-slate-700 p-4">
            <h2 className="text-white text-lg font-semibold mb-4">Leaderboard</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-bold text-lg">1</span>
                  <Avatar
                    src="https://res.cloudinary.com/demo/image/upload/w_64,h_64,c_fill,g_face/sample.jpg"
                    fallback="AK"
                    size="2"
                  />
                  <span className="text-white font-medium">Alex Kim</span>
                </div>
                <span className="text-white font-semibold">5,980 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-bold text-lg">2</span>
                  <Avatar
                    src="https://res.cloudinary.com/demo/image/upload/w_64,h_64,c_fill,g_face/woman.jpg"
                    fallback="RS"
                    size="2"
                  />
                  <span className="text-white font-medium">Riya Sen</span>
                </div>
                <span className="text-white font-semibold">5,430 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-bold text-lg">3</span>
                  <Avatar
                    src="https://res.cloudinary.com/demo/image/upload/w_64,h_64,c_fill,g_face/man.jpg"
                    fallback="DM"
                    size="2"
                  />
                  <span className="text-white font-medium">Diego M.</span>
                </div>
                <span className="text-white font-semibold">5,110 XP</span>
              </div>
            </div>
          </Card>

        
          <Card className="bg-slate-900 border-slate-700 p-4">
            <h2 className="text-white text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="text-sm text-gray-300 leading-relaxed">
                New course "Zero-Knowledge Proofs" is now live.
              </div>
              <div className="text-sm text-gray-300 leading-relaxed">You earned the "Streak x7" badge! +200 XP</div>
              <div className="text-sm text-gray-300 leading-relaxed">Community AMA with Dr. Lin tomorrow 5 PM UTC.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
