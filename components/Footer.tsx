import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Mail, MessageCircle, Send } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import LiveClock from './LiveClock';

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

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
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-5 sm:px-6">

        {/* Main grid */}
        <div className="py-8 sm:py-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-6 sm:gap-8">

          {/* Brand — full row on mobile, 5 cols on desktop */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="BGL" width={28} height={28} className="rounded-lg" />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  BHARAT<span className="text-google-blue">GAMING</span>
                </span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-slate-400 uppercase">League</span>
              </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4 max-w-xs">
              India's premier competitive gaming platform. Safe, transparent esports for everyone.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 text-slate-400 hover:text-google-blue hover:border-google-blue/30 transition-all border border-slate-200 dark:border-slate-800">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="text-xs font-medium text-slate-500 hover:text-google-blue transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-3">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="text-xs font-medium text-slate-500 hover:text-google-blue transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full row on mobile, 3 cols on desktop */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-3">Connect</h4>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <ContactLink href="mailto:worktoearn@gmail.com" icon={Mail} color="text-google-blue bg-blue-50 dark:bg-blue-500/10" label="Email Support" />
              <ContactLink href="https://wa.me/917488168228" icon={MessageCircle} color="text-google-green bg-green-50 dark:bg-green-500/10" label="WhatsApp" />
              <ContactLink href="https://t.me/freefire_tounamentt" icon={Send} color="text-google-blue bg-blue-50 dark:bg-blue-500/10" label="Telegram" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
            © 2026 Bharat Gaming League · India's Premier Esports Hub
          </p>
          <div className="flex items-center gap-4">
            <LiveClock />
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Theme</span>
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
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className={`w-7 h-7 flex items-center justify-center rounded-md ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{label}</span>
    </a>
  );
}
