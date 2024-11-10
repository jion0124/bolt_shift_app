"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function NavLink({ href, icon: Icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg"
    >
      <Icon size={20} />
      {children}
    </Link>
  );
} 