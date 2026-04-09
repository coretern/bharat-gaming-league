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
    <footer className="bg-background border-t border-foreground/5 relative">
      {/* Top purple gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent" />

      <div className="container mx-auto px-6 py-14">

        {/* Main 3-col grid: Brand | Support | Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Bharat Gaming League" width={38} height={38} className="rounded-xl" />
              <span className="text-lg font-black tracking-tighter text-foreground uppercase italic leading-tight">
                Bharat<span className="text-neon-cyan">Gaming</span>
                <span className="block text-[10px] font-black tracking-[0.3em] text-foreground/40 normal-case not-italic">League</span>
              </span>
            </Link>
            <p className="text-foreground/50 text-sm leading-relaxed mb-6">
              India's most trusted esports platform — running since 2021. Fair play, big prizes, timely payouts.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 flex-wrap">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-neon-cyan transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              {/* Telegram */}
              <a href="https://t.me/freefire_tounamentt" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-[#29b6f6] transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.16 13.67l-2.964-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.992.889z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Support */}
          <div>
            <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-5">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-foreground/50 hover:text-neon-cyan text-sm font-medium transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-5">Contact Us</h4>
            <ul className="space-y-3 text-sm text-foreground/50 font-medium">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>support@bharatgamingleague.in</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📱</span>
                <span>WhatsApp: +91 00000 00000</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span>
                <span>Mon–Sat, 10am – 8pm</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✈️</span>
                <a href="https://t.me/freefire_tounamentt" target="_blank" rel="noopener noreferrer"
                  className="text-[#29b6f6] hover:underline font-bold">
                  t.me/freefire_tounamentt
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-foreground/5 flex flex-col sm:flex-row justify-between items-center gap-2 text-foreground/30 text-xs font-bold uppercase tracking-widest">
          <p>© 2026 Bharat Gaming League.</p>
          <p>Designed with ❤️ for Gamers</p>
        </div>

      </div>
    </footer>
  );
}
