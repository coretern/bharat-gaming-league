import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, MessageCircle, Send } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import LiveClock from './LiveClock';

const platformLinks = [
  { name: 'Tournaments', href: '/tournaments' },
  { name: 'Winners', href: '/winners' },
  { name: 'Rules', href: '/rules' },
];

const supportLinks = [
  { name: 'Help Center', href: '/help' },
  { name: 'Terms', href: '/terms' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Refund Policy', href: '/refund' },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Main grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <Image src="/logo.png" alt="BGL" width={30} height={30} className="rounded-lg shadow-sm" />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none uppercase">
                  Bharat<span className="text-google-blue">Gaming</span>
                </span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase mt-0.5">League</span>
              </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5 max-w-xs font-normal">
              India's premier competitive gaming platform. Safe, transparent esports for everyone.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-white dark:hover:text-white border border-slate-200/60 dark:border-slate-800 transition-all duration-200 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-white border border-slate-200/60 dark:border-slate-800 transition-all duration-200 hover:bg-[#FF0000] hover:border-transparent">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Discord"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-white border border-slate-200/60 dark:border-slate-800 transition-all duration-200 hover:bg-[#5865F2] hover:border-transparent">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="text-sm font-normal text-slate-500 dark:text-slate-400 hover:text-google-blue dark:hover:text-blue-400 transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="text-sm font-normal text-slate-500 dark:text-slate-400 hover:text-google-blue dark:hover:text-blue-400 transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Links */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Connect</h4>
            <div className="flex flex-col gap-2.5 max-w-xs">
              <ContactLink href="https://wa.me/917488168228" icon={MessageCircle} color="text-google-green bg-green-50 dark:bg-green-500/10" label="WhatsApp" />
              <ContactLink href="https://t.me/freefire_tounamentt" icon={Send} color="text-google-blue bg-blue-50 dark:bg-blue-500/10" label="Telegram" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-normal text-slate-500 dark:text-slate-400 text-center md:text-left">
            © 2026 Bharat Gaming League · India's Premier Esports Hub
          </p>
          <div className="flex items-center gap-4">
            <LiveClock />
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactLink({ href, icon: Icon, color, label }: { href: string; icon: any; color: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200">
      <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    </a>
  );
}

