import { Trophy, Zap, Book, CoinsIcon, OrbitIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function OverView() {
  
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded transform rotate-45 opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-70"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 transform rotate-45 opacity-50"></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-white rounded-full opacity-40"></div>
        <div className="absolute bottom-60 right-1/4 w-2 h-2 bg-cyan-300 rounded-full opacity-60"></div>

        <div className="absolute top-32 right-32 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transform rotate-12 opacity-30"></div>
        <div className="absolute bottom-32 left-32 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded transform rotate-45 opacity-40"></div>
      </div>

      {/* Top Banner */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-full px-4 py-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-white text-sm font-medium">Nova Labs presents</span>
        </div>
      </div>

      {/* Top Left Trophy */}
      <div className="absolute top-8 left-8 z-10">
        <Trophy className="w-8 h-8 text-yellow-400" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Learn, Earn
          </span>
          <br />
          <span className="text-white">& Grow in Web3</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            with EduChain
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-12 leading-relaxed">
          Transform education with blockchain technology. Earn verifiable credentials, XP rewards, and digital assets
          while mastering new skills in our gained learning ecosystem.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 relative">
          {/* Explore EduChain → Navigates to /dashboard */}
          <Link
            to="/user_dashboard"
            className="bg-transparent border-2 border-white text-white hover:bg-cyan-400 hover:text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-center"
          >
            Explore EduChain
          </Link>

          
        </div>

        {/* Center Animated Logo */}
        <div className="relative w-full max-w-4xl h-64 mb-8">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-500 rounded-full blur-xl opacity-60 w-32 h-32"></div>

              <div className="relative w-32 h-32 bg-gradient-to-r from-white to-blue-500 rounded-full flex items-center justify-center">
                <div className="text-4xl font-bold text-white">E💧U</div>
              </div>

              <div
                className="absolute inset-0 border-2 border-cyan-400/30 rounded-full w-40 h-40 -top-4 -left-4 animate-spin"
                style={{ animationDuration: "10s" }}
              >
                <OrbitIcon />
              </div>
              <div
                className="absolute inset-0 border border-blue-400/20 rounded-full w-48 h-48 -top-8 -left-8 animate-spin"
                style={{ animationDuration: "15s", animationDirection: "reverse" }}
              ></div>
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute top-8 left-1/4 transform -translate-x-1/2">
            <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded transform rotate-12 shadow-lg">
              <Book className="w-6 h-6 text-white m-1" />
            </div>
          </div>

          <div className="absolute top-12 right-1/4 transform translate-x-1/2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <CoinsIcon className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-80 h-4 bg-gradient-to-r from-purple-600/40 to-cyan-600/40 rounded-full blur-sm"></div>
            <div className="w-64 h-8 bg-gradient-to-r from-purple-500/60 to-cyan-500/60 rounded transform -skew-x-12 -mt-2"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-4xl mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-400 text-sm md:text-base">Active Learners</div>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-400 text-sm md:text-base">Courses Available</div>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                1M+
              </div>
              <div className="text-gray-400 text-sm md:text-base">XP Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/6 w-1 h-1 bg-cyan-300 rounded-full opacity-70 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/12 w-1 h-1 bg-purple-300 rounded-full opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/12 w-1 h-1 bg-pink-300 rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>
    </div>
  );
}

  
