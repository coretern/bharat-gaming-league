import Link from 'next/link';
import { Trophy, Github, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-cyan p-[2px] rounded-xl">
                <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground uppercase italic leading-tight">
                Bharat<span className="text-neon-cyan">Gaming</span>
                <span className="block text-[10px] font-black tracking-[0.3em] text-slate-500 normal-case not-italic">League</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-sm mb-8">
              The premium destination for competitive mobile gaming. Join the elite, compete in high-stakes tournaments, and claim your glory.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-black uppercase italic tracking-widest mb-8">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-slate-500 dark:text-slate-400 font-medium">
              <li><Link href="/" className="hover:text-neon-cyan transition-colors">Home</Link></li>
              <li><Link href="/tournaments" className="hover:text-neon-cyan transition-colors">Tournaments</Link></li>
              <li><Link href="/register" className="hover:text-neon-cyan transition-colors">Registration</Link></li>
              <li><Link href="/dashboard" className="hover:text-neon-cyan transition-colors">User Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-black uppercase italic tracking-widest mb-8">Support</h4>
            <ul className="flex flex-col gap-4 text-slate-500 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Rules & Regulations</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-foreground/5 text-slate-500 text-sm font-bold uppercase tracking-widest">
          <p>© 2026 Bharat Gaming League. All rights reserved.</p>
          <p>Designed with ❤️ for Gamers</p>
        </div>
      </div>
    </footer>
  );
}
