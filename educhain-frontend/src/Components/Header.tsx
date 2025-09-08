import { Menu, X } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { useState } from "react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EduChain</h1>
              <p className="text-xs text-gray-500 font-medium">
                Sui Blockchain
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl">
              <button
                onClick={() => onTabChange("create course")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "create course"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-white hover:bg-blue-900"
                }`}
              >
                🎨 Create Course
              </button>
              <button
                onClick={() => onTabChange("View Courses")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "view courses"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-white hover:bg-blue-900"
                }`}
              >
                🖼️ View Courses
              </button>
            </div>

            <WalletConnect />
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="bg-white rounded-2xl border border-gray-100 mt-4 mb-4 p-6">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    onTabChange("create course");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                    activeTab === "mint"
                      ? "bg-primary-black text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  🎨 Create Course
                </button>
                <button
                  onClick={() => {
                    onTabChange("view courses");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                    activeTab === "view courses"
                      ? "bg-primary-black text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  🖼️ View Courses
                </button>
                <div className="pt-3 border-t border-gray-200">
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
