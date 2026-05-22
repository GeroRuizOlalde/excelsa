"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Settings, TrendingUp, Check } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import { WHATSAPP_LINK } from '@/lib/constants';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const SERVICIOS = [
  {
    num: "01",
    Icon: Building2,
    titulo: "Soluciones Empresariales",
    subtitulo: "La base operativa y legal de su estructura.",
    desc: "Una empresa que no tiene sus cimientos en orden no puede crecer de forma sana. Nos encargamos de que la estructura financiera, legal y administrativa esté alineada con los objetivos de largo plazo.",
    items: [
      { t: "Contabilidad e Impuestos", d: "Liquidaciones proactivas, balances auditados y planificación fiscal que minimiza la carga sin incumplir." },
      { t: "Asesoría Legal",           d: "Blindaje societario, redacción de contratos, cumplimiento normativo y gestión de riesgos jurídicos." },
      { t: "Administración y Finanzas", d: "Gestión de tesorería, flujo de caja, control presupuestario y reducción de costos operativos." },
    ],
    entregables: ["Reporte de rentabilidad real", "Planificación fiscal anual", "Manual de procedimientos administrativos"],
    bg: "bg-white",
  },
  {
    num: "02",
    Icon: Settings,
    titulo: "Gestión y Estrategia",
    subtitulo: "Eficiencia para la toma de decisiones.",
    desc: "La estrategia sin ejecución es sólo una declaración de intenciones. Traducimos los objetivos del negocio en procesos concretos, tableros de control y equipos que saben qué hacer y por qué.",
    items: [
      { t: "Planificación Estratégica OKR", d: "Definición de objetivos trimestrales con métricas de seguimiento y revisiones periódicas." },
      { t: "Logística y Operaciones",       d: "Optimización de la cadena de suministro, reducción de mermas y mejora de tiempos de entrega." },
      { t: "Gestión de Procesos",           d: "Estandarización de flujos de trabajo, manuales de funciones y automatización de tareas repetitivas." },
    ],
    entregables: ["Dashboard de KPIs en tiempo real", "Manual de procesos operativos", "Mapa de riesgos y contingencias"],
    bg: "bg-[#f8fafc]",
  },
  {
    num: "03",
    Icon: TrendingUp,
    titulo: "Crecimiento Sostenible",
    subtitulo: "Visión de futuro y marca con propósito.",
    desc: "El crecimiento verdadero es el que se sostiene en el tiempo. Diseñamos estrategias comerciales, de marca y de responsabilidad corporativa que generan valor en múltiples frentes simultáneamente.",
    items: [
      { t: "Comercialización y Marca",  d: "Estrategia de posicionamiento, gestión de canales de venta y desarrollo de propuesta de valor diferenciada." },
      { t: "Desarrollo de Producto",    d: "Análisis de viabilidad, lanzamiento de nuevas unidades de negocio y expansión de portafolio." },
      { t: "Sostenibilidad (ODS)",       d: "Modelos de negocio responsables alineados con los Objetivos de Desarrollo Sostenible de la ONU." },
    ],
    entregables: ["Plan de ventas trimestral", "Hoja de ruta de expansión", "Informe de impacto sostenible"],
    bg: "bg-white",
  },
];

const PROCESO = [
  { n: "01", t: "Diagnóstico",            d: "Análisis profundo de la estructura operativa, financiera e impositiva." },
  { n: "02", t: "Plan Estratégico",        d: "Hoja de ruta con entregables concretos, plazos y métricas de éxito." },
  { n: "03", t: "Implementación",          d: "Acompañamiento ejecutivo para garantizar la adopción real de los procesos." },
  { n: "04", t: "Medición y Optimización", d: "Auditoría de KPIs y ajustes continuos para asegurar el crecimiento." },
];

export default function ServiciosPage() {
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
              Servicios
            </motion.span>
            <motion.h1 variants={fadeUp}
              className="text-5xl lg:text-7xl font-black text-white tracking-[-0.03em] leading-[0.9]">
              Lo que hacemos.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Tres líneas de servicio que cubren la totalidad de la gestión empresarial.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICIOS DETALLE ── */}
      {SERVICIOS.map(({ num, Icon, titulo, subtitulo, desc, items, entregables, bg }, i) => (
        <section key={i} className={`py-32 lg:py-44 ${bg} ${i > 0 ? 'border-t border-slate-100' : ''}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

              {/* Info */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                className={`space-y-8 ${i % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4">
                  <span className="text-4xl font-black text-slate-200">{num}</span>
                  <div className="w-12 h-12 rounded-xl bg-blue-700/10 flex items-center justify-center text-blue-700">
                    <Icon size={20} />
                  </div>
                </motion.div>
                <motion.h2 variants={fadeUp}
                  className="text-3xl lg:text-4xl font-black text-slate-900 tracking-[-0.025em]">
                  {titulo}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                  {subtitulo}
                </motion.p>
                <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed">
                  {desc}
                </motion.p>
                <motion.div variants={fadeUp} className="pt-2">
                  <Link
                    href={WHATSAPP_LINK} target="_blank"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white
                               font-bold rounded-full hover:bg-[#0c1a3e] transition-all text-sm group"
                  >
                    Consultar sobre este servicio
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Detalles */}
              <div className={`space-y-6 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                {/* Items */}
                {items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="p-7 rounded-2xl border border-slate-100 bg-slate-50/70 hover:border-blue-200 transition-colors"
                  >
                    <h4 className="font-black text-slate-900 mb-2">{item.t}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                  </motion.div>
                ))}

                {/* Entregables */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="p-7 rounded-2xl border border-blue-100 bg-blue-50/50"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-4">
                    Entregables concretos
                  </p>
                  <div className="space-y-2.5">
                    {entregables.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <Check size={14} className="text-blue-700 flex-shrink-0" />
                        {e}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── PROCESO ── */}
      <section className="py-32 lg:py-44 bg-[#080e1d]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
              <motion.span variants={fadeUp} className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400">
                Metodología
              </motion.span>
              <motion.h2 variants={fadeUp}
                className="text-4xl lg:text-5xl font-black text-white tracking-[-0.025em]">
                Cómo trabajamos.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-slate-400 leading-relaxed">
                Un proceso estructurado en cuatro etapas que garantiza resultados medibles en cada proyecto.
              </motion.p>
            </motion.div>
            <div>
              {PROCESO.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.65 }}
                  className="group flex gap-8 py-9 border-b border-white/6 last:border-0"
                >
                  <span className="text-3xl font-black text-white/8 group-hover:text-blue-600/50 transition-colors flex-shrink-0">
                    {p.n}
                  </span>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1.5 group-hover:text-blue-400 transition-colors">{p.t}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{p.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-[-0.025em]"
          >
            ¿Qué servicio necesita su empresa?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500"
          >
            Hacemos un diagnóstico sin cargo para entender su situación y recomendarle el camino más adecuado.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-blue-700 text-white
                         font-black rounded-full hover:bg-[#0c1a3e] transition-all text-sm"
            >
              Solicitar diagnóstico gratuito
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
