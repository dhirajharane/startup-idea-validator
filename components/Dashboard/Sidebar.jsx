"use client";
import { LayoutDashboard, History, LogOut, Bookmark } from "lucide-react";
import { useState } from "react";

export function Sidebar({ activePage, onNavigate }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "history", icon: History, label: "Validation History" },
    { id: "saved-reports", icon: Bookmark, label: "Saved Reports" },
  ];

  return (
    <div
      className="fixed left-0 top-0 h-screen bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ width: isExpanded ? "240px" : "72px" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-5 border-b border-gray-800">
        <div className="relative w-8 h-8 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg blur-sm opacity-75" />
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>S</span>
          </div>
        </div>
        {isExpanded && (
          <span className="ml-3 text-white whitespace-nowrap overflow-hidden" style={{ fontWeight: 600 }}>
            StartupInspector
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col justify-between h-[calc(100vh-64px)] py-6">
        <div className="space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }
                  relative overflow-hidden
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full animate-pulse" />
                )}
                
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                
                {isExpanded && (
                  <span className="whitespace-nowrap overflow-hidden" style={{ fontSize: "14px", fontWeight: 500 }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Separator & Logout */}
        <div className="px-3 space-y-2">
          <div className="h-px bg-gray-800 mb-4" />
          
          <button
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isExpanded && (
              <span className="whitespace-nowrap overflow-hidden" style={{ fontSize: "14px", fontWeight: 500 }}>
                Log Out
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}