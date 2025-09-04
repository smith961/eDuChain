"use client"

import { useState } from "react"
import TopNav from "./TopNav"
import Sidebar from "./SideBar"
import { DashboardContent } from "./DashBoard-Content"
import { LearningPathContent } from "./LearningPathContent"
import ProfileDetailsOverView from "./ProfileDetailsOverView"
import CoursesContentOverView from "./CoursesContentOverView"
import Community from "./Community"
import XpAndRewards from "./Xp&RewardsOverView"
<<<<<<< HEAD
import { useCurrentAccount } from "@mysten/dapp-kit"
=======
import SecurityOverView from "./SecurityOverView"
>>>>>>> refs/remotes/origin/main
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

function CourseContent() {
  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <p className="text-gray-400">Course content coming soon...</p>
    </div>
  )
}


function SecurityContent() {
  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Security</h1>
      <p className="text-gray-400">Security content coming soon...</p>
    </div>
  )
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
      case "mentor":
        return <MentorContent />
      case "admin":
        return <AdminContent />
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
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue to-green rounded-3xl flex items-center justify-center">
              {/* <Image className="w-10 h-10 text-black" /> */}
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
