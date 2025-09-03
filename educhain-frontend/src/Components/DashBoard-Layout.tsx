import TopNav from "./TopNav"
import Sidebar from "./SideBar"
import DashboardContent from "./DashBoard-Content"

export default function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <DashboardContent />
      </div>
    </div>
  )
}
