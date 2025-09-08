"use client"

import { useState } from "react"
import TopNav from "./TopNav"
import Sidebar from "./SideBar"
import { DashboardContent } from "./DashBoard-Content"
import { LearningPathContent } from "./LearningPathContent"
import ProfileDetailsOverView from "./ProfileDetailsOverView"
import CoursesContentOverView from "./CoursesContentOverView"
import LessonViewer from "./LessonViewer"
import Community from "./Community"
import XpAndRewards from "./Xp&RewardsOverView"
import SecurityOverView from "./SecurityOverView"
import { useCurrentAccount } from "@mysten/dapp-kit"
import MentorContentOverView from "./MentorOverView"
import AdminPanel from "./AdminPanel"
function MentorContent() {
  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>
      <p className="text-gray-400">Mentor content coming soon...</p>
    </div>
  )
}

function AdminContent() {
  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-400">Admin content coming soon...</p>
    </div>
  )
}

function LessonsContent() {
  const availableLessons = [
    {
      id: 'sui-move',
      title: 'Introduction to Sui Move Programming',
      description: 'Comprehensive guide to Sui Move programming language',
      difficulty: 'Beginner to Advanced',
      duration: '2-3 hours',
      file: 'sui-move.mdx'
    }
  ];

  const handleLessonClick = (lessonFile: string) => {
    window.location.href = `/lesson/${lessonFile}`;
  };

  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Lessons</h1>
        <p className="text-gray-400">Explore our comprehensive lesson library</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableLessons.map((lesson) => (
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
        return <CoursesContentOverView />
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
