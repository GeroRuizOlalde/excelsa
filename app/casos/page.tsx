"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Globe, BarChart3, Zap, Target } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import { WHATSAPP_LINK } from '@/lib/constants';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const STATS = [
  { value: "200+", label: "Empresas acompañadas",     sub: "PyMEs y corporaciones regionales" },
  { value: "15+",  label: "Años de trayectoria",      sub: "Experiencia comprobada en el mercado" },
  { value: "98%",  label: "Satisfacción de clientes", sub: "Índice de retención documentado" },
  { value: "3×",   label: "Crecimiento promedio",     sub: "Resultado real a 12 meses" },
];

const SECTORES = [
  { Icon: Building2, label: "Construcción e Infraestructura",  desc: "Empresas constructoras, inmobiliarias y desarrolladoras de obra pública y privada." },
  { Icon: Layers,    label: "Manufactura e Industria",          desc: "Plantas industriales, fábricas y empresas de producción regional." },
  { Icon: Globe,     label: "Agroindustria y Exportación",      desc: "Bodegas, empacadoras, cooperativas y exportadores de productos regionales." },
  { Icon: BarChart3, label: "Comercio y Distribución",          desc: "Comercios mayoristas, distribuidores y cadenas de retail locales." },
  { Icon: Zap,       label: "Tecnología y Servicios",           desc: "Startups, agencias, consultoras y empresas de servicios profesionales." },
  { Icon: Target,    label: "Desarrollos Inmobiliarios",        desc: "Fideicomisos, inversores y desarrolladoras residenciales y comerciales." },
];

const TESTIMONIOS = [
  {
    quote: "Lograron lo que otras consultoras no pudieron: que mi equipo adopte los procesos. La visión integrada es su gran valor.",
    autor: "Directora Industrial",
    org:   "Industria manufacturera · San Juan",
  },
  {
    quote: "Profesionalismo y cercanía. Excelsa nos dio el orden administrativo que necesitábamos para poder exportar y escalar.",
    autor: "Socio Gerente",
    org:   "Empresa constructora · Cuyo",
  },
  {
    quote: "El diagnóstico inicial nos abrió los ojos. En seis meses redujimos costos y triplicamos el control sobre el negocio.",
    autor: "Gerente General",
    org:   "Distribuidora regional · San Juan",
  },
  {
    quote: "Por primera vez entendemos realmente la rentabilidad de cada línea. Excelsa transformó la forma en que tomamos decisiones.",
    autor: "Dueño",
    org:   "Comercio mayorista · Cuyo",
  },
];

export default function CasosPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      <NavbarPublic />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 bg-[#080e1d] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),
                              linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-800/12 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
            <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400">
              Casos
            </motion.span>
            <motion.h1 variants={fadeUp}
              className="text-5xl lg:text-7xl font-black text-white tracking-[-0.03em] leading-[0.9]">
              Empresas que confiaron en nosotros.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Resultados reales en industrias diversas a lo largo de toda la región de Cuyo.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
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

      {/* ── SECTORES ── */}
      <section className="py-32 lg:py-44 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-16 space-y-4"
          >
            <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
              Industrias
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-slate-900 tracking-[-0.025em]">
              Experiencia transversal en todos los sectores.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORES.map(({ Icon, label, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group flex gap-5 p-8 rounded-2xl border border-slate-100 bg-slate-50/60
                           hover:border-blue-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center
                                text-slate-400 group-hover:text-blue-700 group-hover:border-blue-200
                                transition-all duration-300 shadow-sm flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1.5">{label}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-32 lg:py-44 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-16 space-y-4"
          >
            <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
              Testimonios
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-slate-900 tracking-[-0.025em]">
              Lo que dicen quienes confían en Excelsa.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIOS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-10"
              >
                <div className="absolute top-6 left-8 text-9xl text-slate-100 font-serif leading-none select-none">"</div>
                <div className="relative z-10 space-y-6">
                  <p className="text-lg text-slate-700 leading-relaxed italic">"{t.quote}"</p>
                  <div className="flex items-center gap-4 pt-5 border-t border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-blue-700/10 flex items-center justify-center text-blue-700 font-black text-sm">
                      {t.autor.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">{t.autor}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{t.org}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-[#080e1d] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[400px] rounded-full bg-blue-700/10 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-white tracking-[-0.025em]"
          >
            Su empresa puede ser el próximo caso de éxito.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Link
              href={WHATSAPP_LINK} target="_blank"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0c1a3e]
                         font-black rounded-full hover:bg-slate-100 transition-all text-sm"
            >
              Hablemos <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
