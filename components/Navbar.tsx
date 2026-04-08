'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Home, Calendar, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy },
  { name: 'Registration', href: '/register', icon: Calendar },
  { name: 'Dashboard', href: '/dashboard', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 border-white/5 bg-black/40 shadow-2xl backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-cyan p-[2px] rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase italic">
            Arena<span className="text-neon-cyan">X</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-all hover:text-neon-cyan flex items-center gap-2",
                pathname === link.href ? "text-neon-cyan neon-glow-cyan" : "text-slate-400"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/register">
            <button className="btn-neon-purple text-xs uppercase tracking-widest px-8">
              Play Now
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            className="text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 glass-card p-6 flex flex-col gap-4 border-white/10 bg-background/80 backdrop-blur-3xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-bold flex items-center gap-4 p-3 rounded-xl transition-colors",
                  pathname === link.href ? "bg-neon-cyan/20 text-neon-cyan" : "text-slate-500 dark:text-slate-400 hover:bg-white/5"
                )}
              >
                <link.icon className="w-6 h-6" />
                {link.name}
              </Link>
            ))}
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <button className="w-full btn-neon-purple py-4 text-sm uppercase tracking-widest mt-2">
                Join Arena
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
