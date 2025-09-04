"use client"

import type React from "react"
import { useState } from "react"
import TopNav from "./TopNav"
import Sidebar from "./SideBar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activePage, setActivePage] = useState("dashboard")

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
