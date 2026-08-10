"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, ArrowUpRight, Mountain, Users } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/nosotros',  label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos',     label: 'Casos' },
  { href: '/contacto',  label: 'Contacto' },
];

const MINERIA_LINK = { href: '/mineria', label: 'Sector Minero' };
const CULTURA_LINK = { href: '/cultura', label: 'Personas y Cultura' };

export default function NavbarPublic() {
  const pathname = usePathname();
  const isHome   = pathname === '/';

  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const floating = isHome && !scrolled && !menuOpen;

  return (
    <motion.nav
      initial={{ y: -22, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 font-body transition-all duration-500 ${
        floating
          ? 'py-6'
          : 'py-3 bg-excelsa-cream/85 backdrop-blur-xl border-b border-excelsa-sand2/60 shadow-[0_1px_30px_-12px_rgba(0,35,102,0.25)]'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">

        {/* Logo montaña */}
        <Link href="/" className="z-50 flex items-center gap-2.5 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Excelsa" className="h-8 w-auto lg:h-9" />
          <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight text-excelsa-navy">
            Excelsa
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-[13px] font-semibold tracking-wide transition-colors ${
                  active ? 'text-excelsa-clay' : 'text-excelsa-ink/70 hover:text-excelsa-navy'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-excelsa-clay" />
                )}
              </Link>
            );
          })}

          {/* Divisor */}
          <span className="h-5 w-px bg-excelsa-sand2/70" />

          {/* Badge Sector Minero — destacado */}
          <Link
            href={MINERIA_LINK.href}
            className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-bold tracking-wide transition-all duration-300 ${
              pathname === MINERIA_LINK.href
                ? 'border-blue-400/70 bg-blue-400/15 text-blue-500 shadow-[0_0_14px_-3px_rgba(96,165,250,0.35)]'
                : 'border-blue-400/40 bg-blue-50/60 text-blue-600 hover:border-blue-400/70 hover:bg-blue-400/15 hover:shadow-[0_0_14px_-3px_rgba(96,165,250,0.3)]'
            }`}
          >
            <Mountain size={13} className="text-blue-400" />
            {MINERIA_LINK.label}
          </Link>

          {/* Badge Personas y Cultura */}
          <Link
            href={CULTURA_LINK.href}
            className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-bold tracking-wide transition-all duration-300 ${
              pathname === CULTURA_LINK.href
                ? 'border-excelsa-clay/70 bg-excelsa-claysoft/40 text-excelsa-clay shadow-[0_0_14px_-3px_rgba(193,95,60,0.35)]'
                : 'border-excelsa-clay/30 bg-excelsa-claysoft/20 text-excelsa-clay hover:border-excelsa-clay/60 hover:bg-excelsa-claysoft/40 hover:shadow-[0_0_14px_-3px_rgba(193,95,60,0.25)]'
            }`}
          >
            <Users size={13} className="text-excelsa-clay" />
            {CULTURA_LINK.label}
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-excelsa-ink/60 transition-colors hover:text-excelsa-navy"
          >
            <LogIn size={13} /> Acceso
          </Link>

          <Link
            href="/contacto"
            className="group flex items-center gap-2 rounded-full bg-excelsa-navy px-5 py-2.5 text-[13px] font-bold text-excelsa-cream shadow-lg shadow-excelsa-navy/20 transition-all hover:bg-excelsa-clay"
          >
            Hablemos
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile */}
        <div className="z-50 flex items-center gap-2 lg:hidden">
          <Link href="/login" className="p-2 text-excelsa-ink/70">
            <LogIn size={18} />
          </Link>
          <button
            aria-label="Menú"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-excelsa-navy"
          >
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
            className="overflow-hidden border-t border-excelsa-sand2/60 bg-excelsa-cream lg:hidden"
          >
            <div className="flex flex-col gap-1 p-7">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b border-excelsa-sand2/50 py-4 font-display text-2xl font-medium transition-colors ${
                    pathname === href ? 'text-excelsa-clay' : 'text-excelsa-navy'
                  }`}
                >
                  {label}
                </Link>
              ))}

              {/* Sector Minero — destacado en mobile */}
              <Link
                href={MINERIA_LINK.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-excelsa-sand2/50 py-4"
              >
                <span className="flex items-center gap-3 font-display text-2xl font-medium text-excelsa-navy">
                  <Mountain size={20} className="text-blue-400" />
                  {MINERIA_LINK.label}
                </span>
                <span className="rounded-full bg-excelsa-clay/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-excelsa-clay">
                  Nuevo
                </span>
              </Link>

              {/* Personas y Cultura — destacado en mobile */}
              <Link
                href={CULTURA_LINK.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-excelsa-sand2/50 py-4"
              >
                <span className="flex items-center gap-3 font-display text-2xl font-medium text-excelsa-navy">
                  <Users size={20} className="text-excelsa-clay" />
                  {CULTURA_LINK.label}
                </span>
              </Link>

              <Link
                href="/contacto"
                onClick={() => setMenuOpen(false)}
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-excelsa-navy py-4 font-bold text-excelsa-cream"
              >
                Hablemos <ArrowUpRight size={16} />
              </Link>
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                onClick={() => setMenuOpen(false)}
                className="mt-2 text-center text-sm font-semibold text-excelsa-ink/60"
              >
                o escribinos por WhatsApp
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
