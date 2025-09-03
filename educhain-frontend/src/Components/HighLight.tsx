const HighLight = () => {
  return (
    <div className="bg-slate-900 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
        
          <div className="inline-flex items-center gap-2 bg-slate-500 border border-slate-700 rounded-full px-4 py-2 mb-8">
            <span className="text-orange-400">🔑</span>
            <span className="text-white text-sm font-medium">Key Highlights</span>
          </div>

          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-purple-400">Revolutionary Features</span>
            <br />
            <span className="text-white">for Modern Learning</span>
          </h1>

        
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Experience the future of education with blockchain-powered learning, gamification, and community
            collaboration.
          </p>
        </div>

    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 group hover:bg-slate-800/70 transition-all duration-300">
            
            <div className="absolute top-4 right-4">
              <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-600">
                Rewards
              </span>
            </div>

            
            <div className="mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-white text-xl font-semibold mb-3">Gained Experience</h3>
            <p className="text-slate-400 leading-relaxed">
              Earn XP, badges, and NFTs as you progress through your learning journey.
            </p>
          </div>

          
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 group hover:bg-slate-800/70 transition-all duration-300">
            
            <div className="absolute top-4 right-4">
              <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-600">
                Blockchain Verified
              </span>
            </div>

        
            <div className="mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>


            <h3 className="text-white text-xl font-semibold mb-3">Verified Credentials</h3>
            <p className="text-slate-400 leading-relaxed">
              Receive tamper-proof certificates stored permanently on-chain.
            </p>
          </div>

          
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 group hover:bg-slate-800/70 transition-all duration-300">
            
            <div className="absolute top-4 right-4">
              <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-600">
                Web3 Native
              </span>
            </div>

            
            <div className="mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
              </div>
            </div>
            
        
            <h3 className="text-white text-xl font-semibold mb-3">Crypto Payments</h3>
            <p className="text-slate-400 leading-relaxed">
              Seamless transactions with cryptocurrency and decentralized payment systems.
            </p>
          </div>

          
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 group hover:bg-slate-800/70 transition-all duration-300">
            
            <div className="absolute top-4 right-4">
              <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-600">
                Social Learning
              </span>
            </div>

        
            <div className="mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-5A1.5 1.5 0 0 0 12.04 8.37L9.5 16H12v6h8zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-6H10l-2.54-7.63A1.5 1.5 0 0 0 6 7.5H1A1.5 1.5 0 0 0-.46 8.37L-3 16h2.5v6h8z" />
                </svg>
              </div>
            </div>

            
            <h3 className="text-white text-xl font-semibold mb-3">Community & Collaboration</h3>
            <p className="text-slate-400 leading-relaxed">
              Connect with peers, join study groups, and collaborate on projects together.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HighLight
