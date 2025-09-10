"use client"

import type React from "react"
import {
  FaTachometerAlt,
  FaBook,
  FaRoute,
  FaGift,
  FaUsers,
  FaChalkboardTeacher,
  FaUserShield,
  FaUser,
  FaShieldAlt,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  page: string
  activePage: string
  onPageChange: (page: string) => void
}

function SidebarItem({ icon, label, page, activePage, onPageChange }: SidebarItemProps) {
  const active = activePage === page

  return (
    <div
      onClick={() => onPageChange(page)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-slate-700 text-white" : "text-gray-400 hover:text-white hover:bg-slate-800"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  )
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

interface SidebarProps {
  activePage: string
  onPageChange: (page: string) => void
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="flex-1 py-6 overflow-y-auto">
        <SidebarSection title="Main">
          <SidebarItem
            icon={<FaTachometerAlt />}
            label="Dashboard"
            page="dashboard"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          <SidebarItem
            icon={<FaBook />}
            label="Courses"
            page="courses"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          <SidebarItem
            icon={<FaFileAlt />}
            label="Lessons"
            page="lessons"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          <SidebarItem
            icon={<FaRoute />}
            label="Learning Path"
            page="learning-path"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          <SidebarItem
            icon={<FaGift />}
            label="XP & Rewards"
            page="rewards"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          <SidebarItem
            icon={<FaChartBar />}
            label="Analytics"
            page="analytics"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          <SidebarItem
            icon={<FaUsers />}
            label="Community"
            page="community"
            activePage={activePage}
            onPageChange={onPageChange}
          />
        </SidebarSection>

        <SidebarSection title="Roles">
          <SidebarItem
            icon={<FaChalkboardTeacher />}
            label="Mentor"
            page="mentor"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          <SidebarItem
            icon={<FaUserShield />}
            label="Admin"
            page="admin"
            activePage={activePage}
            onPageChange={onPageChange}
          />
        </SidebarSection>

        <SidebarSection title="Account">
          <SidebarItem
            icon={<FaUser />}
            label="Profile"
            page="profile"
            activePage={activePage}
            onPageChange={onPageChange}
          />
          {/* <SidebarItem
            icon={<FaShieldAlt />}
            label="Security"
            page="security"
            activePage={activePage}
            onPageChange={onPageChange}
          /> */}
        </SidebarSection>
      </div>
    </div>
  )
}
