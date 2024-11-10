"use client";

import React, { useState } from "react";
import { NavLink } from "@/components/nav-link";
import { Calendar, Users, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "シフト管理", href: "/dashboard", icon: Calendar },
  { name: "従業員管理", href: "/dashboard/employees", icon: Users },
  { name: "設定", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <nav className={cn(
        "bg-gray-800 text-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 hover:bg-gray-700 w-full flex justify-center"
        >
          <Menu size={24} />
        </button>
        <div className="space-y-2 p-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              icon={item.icon}
            >
              <span className={cn("transition-opacity", 
                isCollapsed ? "opacity-0 hidden" : "opacity-100"
              )}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 