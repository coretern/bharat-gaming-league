'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, LogIn, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkType {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  links: LinkType[];
  session: any;
  signOut: () => void;
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
  links,
  session,
  signOut,
}: MobileMenuProps) {
  const pathname = usePathname();
  const [imageError, setImageError] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="md:hidden fixed inset-0 z-40 bg-black/30" 
        onClick={() => setIsOpen(false)} 
      />
      {/* Right side panel */}
      <div className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-[70%] max-w-[300px] bg-white dark:bg-[#0a0a1a] px-5 pb-6 pt-5 flex flex-col gap-3 border-l border-slate-200 dark:border-slate-800 overflow-y-auto shadow-[-8px_0_30px_rgba(0,0,0,0.08)] dark:shadow-[-8px_0_30px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-0.5 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          const isDashboard = link.name === 'Dashboard';
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isDashboard
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/60 dark:border-blue-500/20"
                  : isActive
                    ? "bg-slate-100 dark:bg-white/[0.06] text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 shrink-0",
                isDashboard
                  ? "text-blue-600 dark:text-blue-400"
                  : isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500"
              )} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {!session && (
        <Link
          href="/login"
          onClick={() => setIsOpen(false)}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-slate-800 dark:hover:bg-slate-100"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Link>
      )}
    </div>
    </>
  );
}
