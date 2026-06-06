'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, X, ShieldCheck, Award, Landmark, LayoutDashboard, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import UserMenu from './Navbar/UserMenu';
import MobileMenu from './Navbar/MobileMenu';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Champions', href: '/winners', icon: Award },
  { name: 'Rules', href: '/rules', icon: ShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  const links = [
    ...navLinks,
    ...(session ? [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : []),
    ...(session ? [{ name: 'Withdrawal', href: '/withdrawal', icon: Landmark }] : []),
    ...((session?.user as any)?.isAdmin ? [{ name: 'Admin', href: '/admin', icon: ShieldCheck }] : []),
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 bg-white dark:bg-[#0a0a1a] border-b border-slate-200 dark:border-slate-800",
      scrolled
        ? "shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        : ""
    )}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-[3px] transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="BGL" width={28} height={28} className="rounded-[9px] relative z-10" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                Bharat<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Gaming</span>
              </span>
              <span className="text-[7px] font-bold tracking-[0.35em] text-slate-400 dark:text-slate-600 uppercase mt-[3px]">League</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-slate-50/80 dark:bg-white/[0.03] rounded-full px-1 py-1 border border-slate-200/50 dark:border-white/[0.06]">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-[7px] text-[13px] font-medium tracking-wide transition-all duration-200 rounded-full",
                      isActive
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-none"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : session ? (
              <UserMenu session={session} />
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[13px] font-semibold transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.97] flex items-center gap-2 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all select-none outline-none"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        links={links}
        session={session}
        signOut={signOut}
      />
    </nav>
  );
}
