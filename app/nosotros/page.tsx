"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Globe, Target, Zap } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import { WHATSAPP_LINK } from '@/lib/constants';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

// ─── EQUIPO ────────────────────────────────────────────────────────────────────
// Actualizar src, cargo y descripción cuando lleguen los datos
const EQUIPO = [
  {
    nombre: "Gema Zavalla",
    cargo:  "Socia Fundadora · Dirección Estratégica",
    desc:   "Especialista en planificación estratégica, finanzas corporativas y desarrollo organizacional.",
    foto:   "", // reemplazar con "/fotos/gema.jpg" cuando esté disponible
    inicial: "G",
  },
  {
    nombre: "Leticia García",
    cargo:  "Socia Fundadora · Consultoría Operativa",
    desc:   "Experta en gestión de procesos, logística, administración y acompañamiento ejecutivo.",
    foto:   "", // reemplazar con "/fotos/leticia.jpg" cuando esté disponible
    inicial: "L",
  },
];

const VALORES = [
  { Icon: Shield, titulo: "Compromiso real",       desc: "Nos involucramos hasta ver los resultados. Sin excusas ni informes sin acción." },
  { Icon: Globe,  titulo: "Visión 360°",            desc: "Integramos operación, estrategia, finanzas y legal en una sola mirada." },
  { Icon: Target, titulo: "Ejecución concreta",    desc: "Cada plan tiene responsables, plazos y métricas. Nada queda en el papel." },
  { Icon: Zap,    titulo: "Innovación aplicada",   desc: "Metodologías de clase mundial adaptadas a la realidad de cada empresa." },
];

export default function NosotrosPage() {
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
              Nosotros
            </motion.span>
            <motion.h1 variants={fadeUp}
              className="text-5xl lg:text-7xl font-black text-white tracking-[-0.03em] leading-[0.9]">
              Quiénes somos.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Un equipo comprometido con la transformación real de las organizaciones.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── HISTORIA ── */}
      <section className="py-32 lg:py-44 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="space-y-8"
          >
            <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
              Nuestra historia
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-[-0.025em]">
              Nacimos para hacer lo que otros no hacen: implementar.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed">
              Excelsa nació en San Juan, Argentina, de la convicción de que las empresas de la región merecen
              el mismo nivel de acompañamiento estratégico que las grandes corporaciones del mundo. No como un
              lujo, sino como una herramienta concreta de crecimiento.
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed">
              A lo largo de los años construimos una metodología propia: diagnóstico profundo, plan concreto,
              implementación acompañada y medición rigurosa. El resultado es predecible cuando el proceso es serio.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-3 text-blue-700 font-black uppercase text-[10px]
                           tracking-[0.2em] hover:opacity-70 transition-opacity group"
              >
                Trabajá con nosotros
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Filosofía: 3 pilares */}
          <div className="space-y-6">
            {[
              { n: "01", t: "Estructura",  d: "Cada organización necesita bases sólidas antes de crecer. Construimos los cimientos operativos, legales y financieros." },
              { n: "02", t: "Visión",      d: "Sin una dirección clara, la energía se dispersa. Definimos objetivos, metas y hojas de ruta que el equipo entiende y adopta." },
              { n: "03", t: "Ejecución",   d: "La diferencia está en hacer. Acompañamos a los equipos en la trinchera hasta que los procesos funcionan solos." },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-6 p-8 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-blue-200 transition-colors"
              >
                <span className="text-3xl font-black text-slate-200 flex-shrink-0">{p.n}</span>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{p.t}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOTO GRUPAL ── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="rounded-3xl overflow-hidden aspect-[16/7] shadow-2xl"
          >
            <img
              src="/DSC_4808.JPG"
              alt="Equipo Excelsa"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="py-32 lg:py-44 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-16 space-y-4"
          >
            <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
              Nuestro equipo
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-slate-900 tracking-[-0.025em]">
              Las personas detrás de Excelsa.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {EQUIPO.map(({ nombre, cargo, desc, foto, inicial }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="group flex flex-col gap-6 p-8 rounded-3xl border border-slate-100
                           bg-slate-50/60 hover:border-blue-200 hover:shadow-lg transition-all duration-500"
              >
                {/* Foto / Placeholder */}
                <div className="aspect-square w-full max-w-[220px] rounded-2xl overflow-hidden border border-slate-200 self-start">
                  {foto ? (
                    <img src={foto} alt={nombre} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full bg-[#0c1a3e] flex items-center justify-center
                                    text-5xl font-black text-blue-400/60">
                      {inicial}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{nombre}</h3>
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{cargo}</p>
                  <p className="text-sm text-slate-500 leading-relaxed pt-1">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className="py-32 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-16 space-y-4 text-center"
          >
            <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
              Filosofía
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-3xl lg:text-4xl font-black text-slate-900 tracking-[-0.025em]">
              Los valores que guían cada proyecto.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALORES.map(({ Icon, titulo, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group p-8 rounded-2xl bg-white border border-slate-100
                           hover:border-blue-200 hover:shadow-lg transition-all duration-400"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center
                                text-blue-700 group-hover:bg-blue-700 group-hover:text-white
                                group-hover:border-transparent transition-all duration-300 mb-6">
                  <Icon size={18} />
                </div>
                <h4 className="text-base font-black text-slate-900 mb-2">{titulo}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
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
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400"
          >
            Trabajemos juntos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl lg:text-5xl font-black text-white tracking-[-0.025em]"
          >
            ¿Listo para transformar su empresa?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={WHATSAPP_LINK} target="_blank"
              className="group flex items-center gap-3 px-10 py-5 bg-white text-[#0c1a3e]
                         font-black rounded-full hover:bg-slate-100 transition-all text-sm"
            >
              Hablemos <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/servicios"
              className="px-8 py-4 border border-white/15 text-white font-bold rounded-full
                         hover:border-white/40 hover:bg-white/5 transition-all text-sm"
            >
              Ver servicios
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
