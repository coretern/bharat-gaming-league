'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Home, User, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 bg-background/80 shadow-lg backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Bharat Gaming League"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="text-xl font-black tracking-tighter text-foreground uppercase italic leading-tight">
            Bharat<span className="text-neon-cyan">Gaming</span>
            <span className="block text-[10px] font-black tracking-[0.3em] text-slate-500 normal-case not-italic">League</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-all hover:text-neon-cyan flex items-center gap-1.5",
                pathname === link.href ? "text-neon-cyan" : "text-slate-500 hover:text-foreground"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}


          {status === 'loading' ? null : session ? (
            <div className="flex items-center gap-3">
              {/* Profile pic → links to dashboard */}
              <Link href="/dashboard" title="My Dashboard">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-neon-cyan/40 hover:ring-neon-cyan transition-all cursor-pointer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-neon-purple/20 flex items-center justify-center ring-2 ring-neon-purple/40 hover:ring-neon-purple transition-all cursor-pointer">
                    <User className="w-4 h-4 text-neon-purple" />
                  </div>
                )}
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-2 btn-neon-purple text-xs uppercase tracking-widest px-5"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile profile pic → dashboard */}
          {session?.user?.image && (
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Image
                src={session.user.image}
                alt="avatar"
                width={30}
                height={30}
                className="rounded-full ring-2 ring-neon-cyan/30"
              />
            </Link>
          )}
          <button className="text-foreground p-1" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 glass-card p-5 flex flex-col gap-3 bg-background/95 backdrop-blur-3xl shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-base font-bold flex items-center gap-3 p-3 rounded-xl transition-colors",
                pathname === link.href ? "bg-neon-cyan/10 text-neon-cyan" : "text-slate-500 hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
          {/* Dashboard link in mobile menu when logged in */}
          {session && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-base font-bold flex items-center gap-3 p-3 rounded-xl transition-colors",
                pathname === '/dashboard' ? "bg-neon-cyan/10 text-neon-cyan" : "text-slate-500 hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <User className="w-5 h-5" />
              My Dashboard
            </Link>
          )}
          <div className="pt-2 border-t border-foreground/5">
            {session ? (
              <button
                onClick={() => { signOut(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-base font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" /> Logout ({session.user?.name?.split(' ')[0]})
              </button>
            ) : (
              <button
                onClick={() => { signIn('google'); setIsOpen(false); }}
                className="w-full btn-neon-purple py-3 text-sm uppercase tracking-widest flex items-center justify-center gap-2 mt-1"
              >
                <LogIn className="w-4 h-4" /> Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
