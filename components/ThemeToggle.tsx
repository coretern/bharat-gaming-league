'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  const modes = [
    { value: 'light', icon: Sun },
    { value: 'dark', icon: Moon },
    { value: 'system', icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setTheme(mode.value)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300",
            theme === mode.value 
              ? "bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.5)]" 
              : "text-slate-400 hover:text-white"
          )}
          title={`Switch to ${mode.value} mode`}
        >
          <mode.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
