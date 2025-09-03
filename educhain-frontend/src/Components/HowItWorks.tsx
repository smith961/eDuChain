const HowItWork = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Connect with your Wallet and set up your learning profile in under 2 minutes.",
      badge: "Quick Setup",
      icon: "👤",
    },
    {
      number: "02",
      title: "Pick a Course",
      description: "Browse our library and choose a course that matches your goals and skill level.",
      badge: "Course Library",
      icon: "📚",
    },
    {
      number: "03",
      title: "Learn & Earn XP",
      description: "Complete lessons, quizzes, and projects to earn Experience Points and unlock achievements.",
      badge: "Gained Learning",
      icon: "🏆",
    },
    {
      number: "04",
      title: "Get Verified Credentials",
      description: "Receive blockchain-verified certificates that prove your skills to employers worldwide.",
      badge: "Blockchain Verified",
      icon: "🎓",
    },
  ]

  return (
    <div className="bg-slate-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How EduChain Works</h2>
          <p className="text-white-400 text-xl max-w-2xl mx-auto">
            Start learning today with our straightforward process
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-black-500 mb-4">{step.number}</div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      <span className="px-3 py-1 bg-purple-500/20 text-black-300 text-sm rounded-full border border-purple-500/30">
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-2xl p-8 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Ready to get started?</h3>
            <p className="text-slate-400">Join thousands of learners already building their skills on EduChain.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWork
