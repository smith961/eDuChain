import { FaBook, FaSearch } from "react-icons/fa"
import { Avatar } from "@radix-ui/themes"
import { WalletConnect } from "./WalletConnect"
import { useCurrentAccount } from "@mysten/dapp-kit"

export default function TopNav() {
  const currentAccount = useCurrentAccount();
  return (
    <div className="w-full h-16 bg-slate-900 shadow-md flex items-center justify-between px-6 border-b border-slate-700">

      <div className="flex items-center space-x-2">
        <FaBook className="text-2xl text-white" />
        <span className="text-2xl font-bold text-white">EduChain</span>
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, mentors, topics..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">

        {currentAccount ? (
          <>
            <WalletConnect />
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
              Redeem XP
            </button>
            <Avatar src="/diverse-user-avatars.png" fallback="U" size="2" className="cursor-pointer" />
          </>
        ) : (
          <>
            <WalletConnect />
          </>
        )}

      </div>
    </div>
  )
}

