import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'AI Assistant', href: '#assistant' },
  { label: 'Contact', href: '#contact' }
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link href="#home" className="font-semibold text-lg tracking-[0.18em] text-gold">
          AI GROWTH SYSTEMS
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-foreground transition hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-foreground transition hover:bg-white/10"
          >
            Login
          </Link>
          <button className="inline-flex items-center rounded-full bg-gold px-4 py-3 text-sm font-medium text-background shadow-glow transition hover:brightness-95 md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
