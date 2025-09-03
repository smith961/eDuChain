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
} from "react-icons/fa"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <div
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

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="flex-1 py-6">
        <SidebarSection title="Main">
          <SidebarItem icon={<FaTachometerAlt />} label="Dashboard" active />
          <SidebarItem icon={<FaBook />} label="Courses" />
          <SidebarItem icon={<FaRoute />} label="Learning Path" />
          <SidebarItem icon={<FaGift />} label="XP & Rewards" />
          <SidebarItem icon={<FaUsers />} label="Community" />
        </SidebarSection>

        <SidebarSection title="Roles">
          <SidebarItem icon={<FaChalkboardTeacher />} label="Mentor" />
          <SidebarItem icon={<FaUserShield />} label="Admin" />
        </SidebarSection>

        <SidebarSection title="Account">
          <SidebarItem icon={<FaUser />} label="Profile" />
          <SidebarItem icon={<FaShieldAlt />} label="Security" />
        </SidebarSection>
      </div>
    </div>
  )
}
