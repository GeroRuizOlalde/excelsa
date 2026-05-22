"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Settings, TrendingUp, MessageCircle, ArrowUpRight } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import { WHATSAPP_LINK } from '@/lib/constants';

// ─── DATOS ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "200+", label: "Empresas acompañadas",     sub: "PyMEs y corporaciones regionales" },
  { value: "15+",  label: "Años de trayectoria",      sub: "Experiencia comprobada en el mercado" },
  { value: "98%",  label: "Satisfacción de clientes", sub: "Índice de retención documentado" },
  { value: "3×",   label: "Crecimiento promedio",     sub: "Resultado real a 12 meses" },
];

const SERVICIOS = [
  {
    num: "01", Icon: Building2,
    titulo: "Soluciones Empresariales",
    desc:   "Estructura financiera, legal y administrativa de alto nivel.",
    items:  ["Contabilidad e Impuestos", "Asesoría Legal", "Administración y Finanzas"],
  },
  {
    num: "02", Icon: Settings,
    titulo: "Gestión y Estrategia",
    desc:   "Metodologías de clase mundial adaptadas a su organización.",
    items:  ["Planificación Estratégica OKR", "Logística y Operaciones", "Gestión de Procesos"],
  },
  {
    num: "03", Icon: TrendingUp,
    titulo: "Crecimiento Sostenible",
    desc:   "Estrategia comercial, marca y responsabilidad corporativa.",
    items:  ["Comercialización y Marca", "Desarrollo de Producto", "Sostenibilidad (ODS)"],
  },
];

const MARQUEE_ITEMS = [
  "Consultoría Estratégica", "Gestión Financiera", "Asesoría Legal",
  "Planificación OKR", "Sostenibilidad", "Crecimiento Empresarial",
  "Logística y Operaciones", "Comercialización",
];

// ─── ANIMACIONES ────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

// ─── PÁGINA ─────────────────────────────────────────────────────────────────────
export default function LandingExcelsa() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">

      {/* WHATSAPP FLOTANTE */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 right-8 z-[60]"
      >
        <Link
          href={WHATSAPP_LINK} target="_blank"
          className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 rounded-full
                     shadow-2xl shadow-green-500/30 hover:scale-105 transition-transform font-semibold text-sm"
        >
          <MessageCircle size={20} />
          <span className="hidden md:block">¿Hablamos?</span>
        </Link>
      </motion.div>

      <NavbarPublic />

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080e1d]">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),
                              linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-blue-800/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3  w-[500px] h-[500px] rounded-full bg-blue-900/10  blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-36 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-9">

            <motion.div variants={fadeUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full
                               border border-blue-500/20 bg-blue-500/6
                               text-blue-400 text-[10px] font-black uppercase tracking-[0.32em]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Consultoría Empresarial · San Juan, Argentina
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white
                         leading-[0.88] tracking-[-0.03em]">
              Soluciones estratégicas
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                para empresas
              </span>
              <br />
              que buscan crecer.
            </motion.h1>

            <motion.p variants={fadeUp}
              className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Acompañamos organizaciones con innovación, estructura y visión de futuro.
              Unificamos dirección comercial, financiera y legal para un crecimiento sin techo.
            </motion.p>

            <motion.div variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                href="/servicios"
                className="group flex items-center gap-3 px-9 py-[18px] bg-white text-[#0c1a3e]
                           font-bold rounded-full hover:bg-slate-100 transition-all text-sm tracking-wide
                           shadow-xl shadow-white/10"
              >
                Conocé nuestros servicios
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contacto"
                className="flex items-center gap-3 px-9 py-[18px] border border-white/15
                           text-white font-bold rounded-full hover:border-white/40
                           hover:bg-white/5 transition-all text-sm tracking-wide"
              >
                <MessageCircle size={15} /> Contactanos
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] font-bold">Descubrí más</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
            <ArrowUpRight size={13} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ MARQUEE ══════════ */}
      <div className="bg-blue-700 py-4 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee w-max gap-0">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <span key={i}
              className="inline-flex items-center gap-10 px-5 text-white/90 text-[10px] font-black uppercase tracking-[0.32em]">
              {text}<span className="text-white/30 text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ NAVEGACIÓN A SECCIONES ══════════ */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: '/nosotros',  label: 'Nosotros',   desc: 'Quiénes somos y cómo trabajamos' },
              { href: '/servicios', label: 'Servicios',  desc: 'Nuestras tres líneas de servicio' },
              { href: '/casos',     label: 'Casos',      desc: 'Industrias y resultados reales' },
              { href: '/contacto',  label: 'Contacto',   desc: 'Hablemos de tu empresa' },
            ].map(({ href, label, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <Link
                  href={href}
                  className="group flex flex-col gap-3 p-7 rounded-2xl border border-slate-100 bg-slate-50/60
                             hover:border-blue-700/30 hover:bg-blue-50/30 hover:shadow-md transition-all duration-300"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{`0${i + 1}`}</span>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">{label}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                  <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-200">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.65 }}
                className="px-10 py-14 lg:py-16"
              >
                <div className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">{s.value}</div>
                <div className="mt-4 space-y-1">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-widest">{s.label}</div>
                  <div className="text-xs text-slate-400 leading-snug">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ NOSOTROS TEASER ══════════ */}
      <section className="py-32 lg:py-44 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
            className="space-y-8"
          >
            <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
              Quiénes somos
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-4xl lg:text-[3.5rem] font-black text-slate-900 leading-tight tracking-[-0.025em]">
              Estructura, visión y ejecución en una sola alianza.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed">
              Excelsa es una consultora empresarial integral con base en San Juan. Nacimos para
              acompañar a dueños y directivos en la profesionalización de sus organizaciones,
              aportando una visión 360° desde la operación diaria hasta la estrategia de largo plazo.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-3 text-blue-700 font-black uppercase
                           text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity group"
              >
                Conocé el equipo <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img src="/DSC_4808.JPG" alt="Equipo Excelsa" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -right-5 w-40 h-40 rounded-2xl bg-blue-700/15 -z-10" />
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-8 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100"
            >
              <div className="text-4xl font-black text-slate-900 tracking-tight">200+</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Empresas acompañadas</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ SERVICIOS PREVIEW ══════════ */}
      <section className="py-32 lg:py-44 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div className="space-y-4 max-w-xl">
              <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
                Nuestros servicios
              </motion.span>
              <motion.h2 variants={fadeUp}
                className="text-4xl lg:text-[3.5rem] font-black text-slate-900 leading-tight tracking-[-0.025em]">
                Soluciones integrales para cada etapa.
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-3 text-blue-700 font-black uppercase
                           text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity group whitespace-nowrap"
              >
                Ver todos <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SERVICIOS.map(({ num, Icon, titulo, desc, items }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white border border-slate-200/80 rounded-3xl p-10
                           overflow-hidden hover:border-blue-600/20 hover:shadow-2xl
                           hover:shadow-blue-700/6 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700/3 to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative z-10 space-y-7">
                  <div className="flex items-start justify-between">
                    <span className="text-5xl font-black text-slate-100 group-hover:text-blue-100/80 transition-colors">{num}</span>
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center
                                    text-blue-700 group-hover:bg-blue-700 group-hover:text-white
                                    group-hover:border-transparent transition-all duration-300">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{titulo}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                  <div className="pt-5 border-t border-slate-100 space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-700 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ DIFERENCIAL ══════════ */}
      <section className="py-24 bg-[#0c1a3e] overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),
                              linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl lg:text-5xl font-black text-white leading-tight tracking-[-0.025em] max-w-4xl mx-auto"
          >
            No vendemos promesas. Acompañamos la implementación real de cada proceso, hasta ver los resultados.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 mt-4 text-blue-400 hover:text-white
                         font-black uppercase text-[10px] tracking-[0.25em] transition-colors group"
            >
              Solicitá tu diagnóstico gratuito
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="py-32 lg:py-44 bg-[#080e1d] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[900px] h-[500px] rounded-full bg-blue-700/10 blur-[130px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="space-y-8"
          >
            <motion.span variants={fadeUp}
              className="inline-block text-[10px] font-black uppercase tracking-[0.35em] text-blue-400">
              Empecemos juntos
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-[-0.03em]">
              Construimos relaciones empresariales a largo plazo.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
              El primer paso es un diagnóstico sin cargo. Conversamos sobre su empresa,
              identificamos oportunidades y diseñamos juntos el camino.
            </motion.p>
            <motion.div variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/contacto"
                className="group flex items-center gap-3 px-10 py-5 bg-white text-[#0c1a3e]
                           font-black rounded-full hover:bg-slate-100 transition-all text-sm tracking-wide
                           shadow-2xl shadow-white/10"
              >
                Hablemos <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white
                           font-bold rounded-full hover:border-white/40 hover:bg-white/5 transition-all text-sm"
              >
                Acceso clientes
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
