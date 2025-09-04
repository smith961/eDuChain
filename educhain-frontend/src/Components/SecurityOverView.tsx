export default function SecurityOverView() {
  return (
    <div className="flex h-screen w-full bg-[#1A1C28] text-gray-100 p-8">
    
      <div className="w-2/3 pr-8">
        <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>

  
        <div className="flex space-x-4 mb-8">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-[#3D4155] transition-colors duration-200">
            Account
          </button>
          <button className="bg-transparent text-gray-400 px-6 py-2 rounded-lg hover:bg-[#2C2F3F] transition-colors duration-200">
            Devices
          </button>
          <button className="bg-transparent text-gray-400 px-6 py-2 rounded-lg hover:bg-[#2C2F3F] transition-colors duration-200">
            Recovery
          </button>
        </div>

        
        <div className="bg-[#1D1E2B] p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Two-Factor Authentication (2FA)</h3>

        
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Authenticator App</h4>
            <p className="text-gray-400 text-sm mb-3">Use an authenticator app for time-based codes.</p>
            <div className="flex space-x-4">
              <button className="bg-[#2C2F3F] text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200">
                Disable
              </button>
              <button className="bg-[#2C2F3F] text-white-300 px-4 py-2 rounded-md hover:bg-[#3D4155] transition-colors duration-200">
                Regenerate QR
              </button>
            </div>
          </div>

      
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">SMS Backup Codes</h4>
            <p className="text-gray-400 text-sm mb-3">Receive one-time backup codes via SMS if your app is unavailable.</p>
            <div className="flex items-center space-x-4">
              <button className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200">
                Enable
              </button>
              <a href="#" className="text-blue-400 text-sm hover:underline">
                Learn more
              </a>
            </div>
          </div>

      
          <div>
            <h4 className="text-lg font-medium mb-2">Passkeys & Biometrics</h4>
            <p className="text-gray-400 text-sm mb-3">Sign in with a device bound passkey for passwords access.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
              Add Passkey
            </button>
          </div>
        </div>

    
        <div className="bg-[#1D1E2B] p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Wallet & Onchain Security</h3>

    
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Primary Wallet</h4>
            <p className="text-gray-400 text-sm mb-3">Used for signing, credential minting and rewards.</p>
            <div className="flex items-center justify-between bg-[#2C2F3F] p-3 rounded-md mb-3">
              <span className="font-mono text-sm">0x8dc4...FA72</span>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-500 transition-colors duration-200">
                  Switch
                </button>
                <button className="bg-red-700 text-white text-sm px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200">
                  Disconnect
                </button>
              </div>
            </div>
          </div>

    
          <div>
            <h4 className="text-lg font-medium mb-2">Signing Method</h4>
            <p className="text-gray-400 text-sm mb-3">Select signing course for messages and transactions.</p>
            <div className="flex items-center justify-between bg-[#2C2F3F] p-3 rounded-md">
              <span className="text-sm">EIP-712</span>
              <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-500 transition-colors duration-200">
                Change
              </button>
            </div>
          </div>
        </div>

        
        <div className="bg-[#1D1E2B] p-6 rounded-lg grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Recovery & Backup</h3>
            <p className="text-green-500 text-sm mb-2">Keep these safe</p>

      
            <h4 className="text-lg font-medium mb-2">Backup Codes</h4>
            <p className="text-gray-400 text-sm mb-3">Not generated</p>
            <p className="text-gray-400 text-sm mb-3">Use 2FA codes for account recovery.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
              Generate
            </button>
          </div>

        
          <div>
            <h4 className="text-lg font-medium mb-2">Recovery Email</h4>
            <p className="text-gray-400 text-sm mb-3">santiago@duchain.io</p>
            <p className="text-gray-400 text-sm mb-3">Used when you lose access to primary factors.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
              Change
            </button>
          </div>
        </div>
      </div>

      
      <div className="w-1/3 pl-8">
        <h2 className="text-2xl font-semibold mb-6">Session Verification</h2>


        <div className="bg-[#1D1E2B] p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Enter 2FA Code</h3>
          <p className="text-gray-400 text-sm mb-4">Step 2 of 2</p>
          <p className="text-gray-400 text-sm mb-4">Confirm this sensitive change by entering your authenticator code.</p>
          <div className="flex justify-between mb-4">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                inputMode="numeric"
                className="w-10 h-10 text-center bg-[#2C2F3F] border border-[#3D4155] rounded-md text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mb-4">Use backup code</p>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
            Confirm
          </button>
        </div>


        <div className="bg-[#1D1E2B] p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Trusted Devices</h3>

  
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">MacBook Pro</h4>
            <p className="text-gray-400 text-sm mb-2">Trusted</p>
            <p className="text-gray-400 text-sm mb-3">Added 30 days ago</p>
            <button className="text-white-500 text-sm hover:underline">Remove</button>
          </div>

        
          <div>
            <h4 className="text-lg font-medium mb-2">iPhone 15</h4>
            <p className="text-gray-400 text-sm mb-2">Trusted</p>
            <p className="text-gray-400 text-sm mb-3">Added 12 days ago</p>
            <button className="text-white-500 text-sm hover:underline">Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}