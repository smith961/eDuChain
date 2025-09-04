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
import SecurityOverView from "./SecurityOverView"
import  MentorContentOverView  from "./MentorOverView"


function AdminContent() {
  return (
    <div className="flex-1 p-6 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-400">Admin content coming soon...</p>
    </div>
  )
}





export default function MainDashboard() {
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
        return <MentorContentOverView />
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
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
