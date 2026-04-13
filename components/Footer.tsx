import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Instagram, Youtube } from 'lucide-react';

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
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/logo.png" alt="Bharat Gaming League" width={32} height={32} className="rounded-lg" />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  BHARAT<span className="text-google-blue">GAMING</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">League</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              India's leading platform for competitive esports since 2021. Secure, transparent, and built for the serious gamer.
            </p>
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="text-slate-400 hover:text-google-blue transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/tournaments" className="text-slate-500 hover:text-google-blue text-sm font-medium transition-colors">Browse Matches</Link></li>
              <li><Link href="/winners" className="text-slate-500 hover:text-google-blue text-sm font-medium transition-colors">Hall of Fame</Link></li>
              <li><Link href="/rules" className="text-slate-500 hover:text-google-blue text-sm font-medium transition-colors">Tournament Rules</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4">
              {supportLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-google-blue text-sm font-medium transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li className="flex items-center gap-3">
                <span className="text-google-blue">📧</span>
                <a href="mailto:worktoearn@gmail.com" className="hover:text-google-blue">worktoearn@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-google-green">📱</span>
                <a href="https://wa.me/917488168228" className="hover:text-google-green">WhatsApp Support</a>
              </li>
              <li>
                <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                   <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Telegram Community</p>
                   <a href="https://t.me/freefire_tounamentt" className="text-xs font-bold text-google-blue hover:underline">t.me/freefire_tounamentt</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <p>© 2026 Bharat Gaming League. All rights reserved.</p>
          <div className="flex gap-6">
            <p>Built for the next generation of esports</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
