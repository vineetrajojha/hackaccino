"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import {
  Home,
  Mic,
  SignpostIcon as SignLanguage,
  Brain,
  Trophy,
  Settings,
  MedalIcon,
  ChevronRight,
} from "lucide-react"

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Mic, label: "Voice Analysis", path: "/voice-analysis" },
    { icon: MedalIcon, label: "Dr.Connect", path: "/dr-connect" },
    { icon: SignLanguage, label: "Sign Language", path: "/sign-language" },
    { icon: Brain, label: "AI Coaching", path: "/ai-coaching" },
    { icon: Trophy, label: "Progress", path: "/progress" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-rose-50 to-white border-r border-rose-100 fixed left-0 top-0 p-4 shadow-sm">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 mb-8 px-2 relative">
        <div className="absolute -z-10 w-10 h-10 bg-rose-100 rounded-full opacity-70 blur-md animate-pulse"></div>
        <Mic className="w-8 h-8 text-rose-600 relative z-10" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
          VocalEdge AI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-rose-100 to-amber-50 text-rose-600 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-rose-50"
              }`
            }
            onMouseEnter={() => setHoveredItem(item.path)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Background animation */}
            {hoveredItem === item.path && !location.pathname.includes(item.path) && (
              <div className="absolute inset-0 bg-rose-50 -z-10 animate-fadeIn" />
            )}

            {/* Icon with animation */}
            <div className={`transition-transform duration-300 ${hoveredItem === item.path ? "scale-110" : ""}`}>
              <item.icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <span className="font-medium">{item.label}</span>

            {/* Active indicator */}
            {location.pathname.includes(item.path) && (
              <ChevronRight className="w-4 h-4 ml-auto text-rose-500 animate-bounceRight" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Decorative elements */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent rounded-full opacity-70"></div>
      </div>
    </div>
  )
}

// Add required animations to your global CSS
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceRight {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-bounceRight {
  animation: bounceRight 1s ease-in-out infinite;
}
`

// Add the styles to the document
const styleElement = document.createElement("style")
styleElement.textContent = globalStyles
document.head.appendChild(styleElement)

export default Sidebar
