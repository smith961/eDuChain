import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Wallet } from "lucide-react";

export function WalletConnect () {
    const currentAccount = useCurrentAccount();

    return (
        <div className="flex items-center gap-4">
      {currentAccount ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">
              Connected
            </span>
          </div>
          <ConnectButton className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="">
            <Wallet className="w-5 h-5 text-white-600" />
          </div>
          <ConnectButton className="" />
        </div>
      )}
    </div>
    )
}

