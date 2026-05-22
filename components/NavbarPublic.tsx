"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/nosotros',  label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos',     label: 'Casos' },
  { href: '/contacto',  label: 'Contacto' },
];

export default function NavbarPublic() {
  const pathname  = usePathname();
  const isHome    = pathname === '/';

  const [scrolled,  setScrolled]  = useState(!isHome);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent py-7'
          : 'bg-white/98 backdrop-blur-xl border-b border-slate-100 py-4 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-50 select-none">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm italic
                           transition-colors duration-300
                           ${transparent ? 'bg-white text-[#0c1a3e]' : 'bg-[#0c1a3e] text-white'}`}>
            E
          </div>
          <span className={`text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-300
                            ${transparent ? 'text-white' : 'text-slate-900'}`}>
            Excelsa
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  active           ? 'text-blue-700' :
                  transparent      ? 'text-white/70 hover:text-white' :
                                     'text-slate-500 hover:text-blue-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full border transition-all ${
              transparent
                ? 'border-white/25 text-white hover:border-white/60'
                : 'border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            <LogIn size={11} /> Acceso
          </Link>
          <Link
            href="/contacto"
            className="bg-blue-700 text-white px-7 py-2.5 rounded-full hover:bg-[#0c1a3e] transition-all shadow-lg shadow-blue-700/25"
          >
            Contactar
          </Link>
        </div>

        {/* Mobile icons */}
        <div className="flex items-center gap-3 lg:hidden z-50">
          <Link href="/login" className={`p-2 rounded-lg transition-colors ${transparent ? 'text-white' : 'text-slate-700'}`}>
            <LogIn size={18} />
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`transition-colors ${transparent ? 'text-white' : 'text-slate-900'}`}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white border-t border-slate-100 lg:hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-black uppercase tracking-widest transition-colors
                               ${pathname === href ? 'text-blue-700' : 'text-slate-900 hover:text-blue-700'}`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                onClick={() => setMenuOpen(false)}
                className="mt-4 py-4 bg-blue-700 text-white font-bold rounded-xl
                           flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                <MessageCircle size={16} /> Contactar por WhatsApp
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
