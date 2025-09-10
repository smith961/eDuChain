import { useState } from "react"
import TopNav from "./TopNav"
import Sidebar from "./SideBar"
import { DashboardContent } from "./DashBoard-Content"
import { LearningPathContent } from "./LearningPathContent"
import ProfileDetailsOverView from "./ProfileDetailsOverView"
import CoursesContentOverView from "./CoursesContentOverView"
import Community from "./Community"
import XpAndRewards from "./Xp&RewardsOverView"
import SecurityOverView from "./SecurityOverView"
import { useCurrentAccount } from "@mysten/dapp-kit"
import MentorContentOverView from "./MentorOverView"
import AdminPanel from "./AdminPanel"


function AnalyticsContent() {
  const [timeRange, setTimeRange] = useState("week")

  // Mock analytics data
  const analyticsData = {
    totalStudyTime: 24.5, // hours
    averageSessionTime: 1.8, // hours
    coursesCompleted: 2,
    lessonsCompleted: 8,
    quizAttempts: 12,
    averageQuizScore: 85,
    currentStreak: 5,
    longestStreak: 12,
    weeklyProgress: [
      { day: 'Mon', hours: 2.1, lessons: 2 },
      { day: 'Tue', hours: 1.8, lessons: 1 },
      { day: 'Wed', hours: 3.2, lessons: 3 },
      { day: 'Thu', hours: 2.5, lessons: 2 },
      { day: 'Fri', hours: 1.9, lessons: 2 },
      { day: 'Sat', hours: 4.1, lessons: 4 },
      { day: 'Sun', hours: 2.8, lessons: 3 }
    ]
  }

  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Analytics</h1>
        <p className="text-gray-400">Track your learning progress and performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Study Time</span>
            <span className="text-blue-400">⏱️</span>
          </div>
          <div className="text-2xl font-bold">{analyticsData.totalStudyTime}h</div>
          <div className="text-sm text-gray-400">+12% from last week</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Courses Completed</span>
            <span className="text-green-400">🎓</span>
          </div>
          <div className="text-2xl font-bold">{analyticsData.coursesCompleted}</div>
          <div className="text-sm text-gray-400">2 in progress</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Average Quiz Score</span>
            <span className="text-yellow-400">📊</span>
          </div>
          <div className="text-2xl font-bold">{analyticsData.averageQuizScore}%</div>
          <div className="text-sm text-gray-400">+5% from last week</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Current Streak</span>
            <span className="text-orange-400">🔥</span>
          </div>
          <div className="text-2xl font-bold">{analyticsData.currentStreak} days</div>
          <div className="text-sm text-gray-400">Best: {analyticsData.longestStreak} days</div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">Weekly Study Activity</h3>
        <div className="grid grid-cols-7 gap-4">
          {analyticsData.weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-gray-400 mb-2">{day.day}</div>
              <div className="bg-blue-600 rounded-lg p-2 mb-2" style={{height: `${day.hours * 20}px`, minHeight: '20px'}}>
                <div className="text-xs font-bold">{day.hours}h</div>
              </div>
              <div className="text-xs text-gray-400">{day.lessons} lessons</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Learning Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lessons Completed</span>
              <span className="font-bold">{analyticsData.lessonsCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Quiz Attempts</span>
              <span className="font-bold">{analyticsData.quizAttempts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Session</span>
              <span className="font-bold">{analyticsData.averageSessionTime}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completion Rate</span>
              <span className="font-bold text-green-400">75%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Achievements This Week</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <span className="text-yellow-400">🏆</span>
              <div>
                <div className="font-medium">First Perfect Quiz</div>
                <div className="text-sm text-gray-400">Scored 100% on Java Basics</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <span className="text-blue-400">🔥</span>
              <div>
                <div className="font-medium">5-Day Streak</div>
                <div className="text-sm text-gray-400">Consistent daily learning</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <span className="text-green-400">📚</span>
              <div>
                <div className="font-medium">Course Completed</div>
                <div className="text-sm text-gray-400">Java Programming Fundamentals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LessonsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const availableLessons = [
    {
      id: 'sui-move',
      title: 'Introduction to Sui Move Programming',
      description: 'Comprehensive guide to Sui Move programming language',
      difficulty: 'Beginner to Advanced',
      duration: '2-3 hours',
      category: 'Blockchain',
      file: 'sui-move.mdx'
    },
    {
      id: 'java-basics',
      title: 'Java Programming Fundamentals',
      description: 'Learn the basics of Java programming from variables to object-oriented concepts',
      difficulty: 'Beginner',
      duration: '1-2 hours',
      category: 'Programming',
      file: 'java-basics.mdx'
    }
  ];

  // Filter and sort lessons
  const filteredLessons = availableLessons
    .filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = selectedDifficulty === "" || lesson.difficulty === selectedDifficulty
      return matchesSearch && matchesDifficulty
    })
    .sort((a, b) => {
      if (sortBy === "newest") return 0 // Keep original order for now
      if (sortBy === "oldest") return 0
      if (sortBy === "difficulty") {
        const difficultyOrder: { [key: string]: number } = { "Beginner": 1, "Intermediate": 2, "Advanced": 3, "Beginner to Advanced": 4 }
        return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0)
      }
      return 0
    })

  const handleLessonClick = (lessonFile: string) => {
    // Check if user needs to take enrollment quiz
    const lessonType = lessonFile.toLowerCase();
    const quizPassedKey = `quiz_passed_${lessonType}`;

    const hasPassedQuiz = localStorage.getItem(quizPassedKey) === 'true';

    if (!hasPassedQuiz && (lessonType.includes('sui') || lessonType.includes('java'))) {
      // Show enrollment quiz first
      alert('You need to pass the enrollment assessment first!');
      // Navigate to lesson where quiz will be shown
      window.location.href = `/lesson/${lessonFile}`;
      return;
    }

    // If quiz passed or not required, go to lesson
    window.location.href = `/lesson/${lessonFile}`;
  };

  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Lessons</h1>
        <p className="text-gray-400">Explore our comprehensive lesson library</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 bg-slate-800 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Beginner to Advanced">Beginner to Advanced</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="difficulty">By Difficulty</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredLessons.length} of {availableLessons.length} lessons
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors cursor-pointer"
            onClick={() => handleLessonClick(lesson.file)}
          >
            <h3 className="text-xl font-semibold mb-3">{lesson.title}</h3>
            <p className="text-gray-400 mb-4">{lesson.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Difficulty: {lesson.difficulty}</span>
              <span>Duration: {lesson.duration}</span>
            </div>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Start Reading
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}





export default function MainDashboard() {
  const currentAccount = useCurrentAccount();
  const [activePage, setActivePage] = useState("dashboard")


  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />
      case "learning-path":
        return <LearningPathContent />
      case "courses":
        return <CoursesContentOverView onPageChange={setActivePage} />
      case "lessons":
        return <LessonsContent />
      case "mentor":
        return <MentorContentOverView />
      case "admin":
        return <AdminPanel />
      case "profile":
        return <ProfileDetailsOverView />
      case "security":
        return <SecurityOverView />
      case "community":
        return <Community />
      case "rewards":
        return <XpAndRewards />
      case "analytics":
        return <AnalyticsContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <TopNav />
      {currentAccount ? (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activePage={activePage} onPageChange={setActivePage} />
          <main className="flex-1 overflow-auto">{renderContent()}</main>
        </div>
      ) : (
        <div className="card text-center">
            <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 mt-8">
            <span className="gradient-text">EDUCHAIN</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Learn, Earn, and Own your unique digital certificates on the Sui
            blockchain
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white px-8 py-4 rounded-full border border-gray-100">
              <span className="text-gray-700 font-semibold">
                ✨ Learning is fun
              </span>
            </div>
            <div className="bg-white px-8 py-4 rounded-full border border-gray-100">
              <span className="text-gray-700 font-semibold">
                🚀 Ownership at its peak
              </span>
            </div>
            <div className="bg-white px-8 py-4 rounded-full border border-gray-100">
              <span className="text-gray-700 font-semibold">🔒 Learn while you Earn</span>
            </div>
          </div>
        </div>
          <h3 className="text-2xl font-bold text-white-900 mb-3">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 text-lg">
            Please connect your Sui wallet to start exploring EduChain.
          </p>
        </div>
      )}

    </div>
  )
}
