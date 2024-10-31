'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'シフト管理', href: '/dashboard', icon: Calendar },
  { name: '従業員管理', href: '/dashboard/employees', icon: Users },
  { name: '設定', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 transform bg-card transition-transform duration-200 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-lg font-bold">シフト管理システム</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
              <LogOut className="mr-3 h-5 w-5" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          'transition-margin duration-200 ease-in-out',
          isSidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
    </div>
  );
}