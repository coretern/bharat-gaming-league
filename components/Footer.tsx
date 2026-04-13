import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Instagram, Youtube, Mail, MessageCircle, Send } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const supportLinks = [
  { name: 'Help Center', href: '/help' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Rules & Regulations', href: '/rules' },
  { name: 'Refund & Cancellation', href: '/refund' },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/logo.png" alt="Bharat Gaming League" width={32} height={32} className="rounded-lg" />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  BHARAT<span className="text-google-blue">GAMING</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">League</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium max-w-sm">
              India's premier competitive gaming platform. Building a safe and transparent ecosystem for professional esports athletes.
            </p>
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-google-blue transition-colors border border-slate-100 dark:border-slate-800">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/tournaments" className="text-slate-500 hover:text-google-blue text-xs font-bold uppercase transition-colors">Tournaments</Link></li>
              <li><Link href="/winners" className="text-slate-500 hover:text-google-blue text-xs font-bold uppercase transition-colors">View Winners</Link></li>
              <li><Link href="/rules" className="text-slate-500 hover:text-google-blue text-xs font-bold uppercase transition-colors">Regulations</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-6">Support</h4>
            <ul className="space-y-4">
              {supportLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-google-blue text-xs font-bold uppercase transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-6">Connect</h4>
            <div className="space-y-4">
              <a href="mailto:worktoearn@gmail.com" className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors hover:border-google-blue/30">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-google-blue">
                   <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Email Support</span>
              </a>
              <a href="https://wa.me/917488168228" className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors hover:border-google-green/30">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-500/10 text-google-green">
                   <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">WhatsApp Live</span>
              </a>
              <a href="https://t.me/freefire_tounamentt" className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors hover:border-google-blue/30">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-google-blue">
                   <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Telegram Community</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            <p>© 2026 Bharat Gaming League</p>
            <span className="hidden md:inline opacity-20">•</span>
            <p>India's Premier Esports Hub</p>
          </div>
          
          <div className="flex items-center gap-4">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Preferences</p>
             <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
