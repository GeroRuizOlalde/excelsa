"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Settings, TrendingUp, Check } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import PageHero from '@/components/PageHero';
import ContourBg from '@/components/ContourBg';
import { WHATSAPP_LINK } from '@/lib/constants';
import { fadeUp, stagger } from '@/lib/motion';

const SERVICIOS = [
  {
    num: "01", Icon: Building2,
    titulo: "Soluciones Empresariales",
    subtitulo: "La base operativa y legal de tu estructura.",
    desc: "Una empresa que no tiene sus cimientos en orden no puede crecer de forma sana. Nos encargamos de que la estructura financiera, legal y administrativa esté alineada con los objetivos de largo plazo.",
    items: [
      { t: "Contabilidad e Impuestos",   d: "Liquidaciones proactivas, balances auditados y planificación fiscal que minimiza la carga sin incumplir." },
      { t: "Asesoría Legal",             d: "Blindaje societario, redacción de contratos, cumplimiento normativo y gestión de riesgos jurídicos." },
      { t: "Administración y Finanzas",  d: "Gestión de tesorería, flujo de caja, control presupuestario y reducción de costos operativos." },
    ],
    entregables: ["Reporte de rentabilidad real", "Planificación fiscal anual", "Manual de procedimientos administrativos"],
  },
  {
    num: "02", Icon: Settings,
    titulo: "Gestión y Estrategia",
    subtitulo: "Eficiencia para la toma de decisiones.",
    desc: "La estrategia sin ejecución es sólo una declaración de intenciones. Traducimos los objetivos del negocio en procesos concretos, tableros de control y equipos que saben qué hacer y por qué.",
    items: [
      { t: "Planificación Estratégica OKR", d: "Definición de objetivos trimestrales con métricas de seguimiento y revisiones periódicas." },
      { t: "Logística y Operaciones",        d: "Optimización de la cadena de suministro, reducción de mermas y mejora de tiempos de entrega." },
      { t: "Gestión de Procesos",            d: "Estandarización de flujos de trabajo, manuales de funciones y automatización de tareas repetitivas." },
    ],
    entregables: ["Dashboard de KPIs en tiempo real", "Manual de procesos operativos", "Mapa de riesgos y contingencias"],
  },
  {
    num: "03", Icon: TrendingUp,
    titulo: "Crecimiento Sostenible",
    subtitulo: "Visión de futuro y marca con propósito.",
    desc: "El crecimiento verdadero es el que se sostiene en el tiempo. Diseñamos estrategias comerciales, de marca y de responsabilidad corporativa que generan valor en múltiples frentes simultáneamente.",
    items: [
      { t: "Comercialización y Marca", d: "Estrategia de posicionamiento, gestión de canales de venta y desarrollo de propuesta de valor diferenciada." },
      { t: "Desarrollo de Producto",  d: "Análisis de viabilidad, lanzamiento de nuevas unidades de negocio y expansión de portafolio." },
      { t: "Sostenibilidad (ODS)",     d: "Modelos de negocio responsables alineados con los Objetivos de Desarrollo Sostenible de la ONU." },
    ],
    entregables: ["Plan de ventas trimestral", "Hoja de ruta de expansión", "Informe de impacto sostenible"],
  },
];

const PROCESO = [
  { n: "01", t: "Diagnóstico",             d: "Análisis profundo de la estructura operativa, financiera e impositiva." },
  { n: "02", t: "Plan Estratégico",         d: "Hoja de ruta con entregables concretos, plazos y métricas de éxito." },
  { n: "03", t: "Implementación",           d: "Acompañamiento ejecutivo para garantizar la adopción real de los procesos." },
  { n: "04", t: "Medición y Optimización",  d: "Auditoría de KPIs y ajustes continuos para asegurar el crecimiento." },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-excelsa-cream font-body text-excelsa-ink antialiased">
      <NavbarPublic />

      <PageHero
        eyebrow="Servicios"
        title="Todo lo que tu empresa necesita, bajo una sola dirección."
        subtitle="Tres líneas de servicio que cubren la totalidad de la gestión empresarial."
      />

      {/* ── DETALLE ── */}
      {SERVICIOS.map(({ num, Icon, titulo, subtitulo, desc, items, entregables }, i) => (
        <section key={i} className={`py-24 lg:py-32 ${i % 2 === 1 ? 'bg-excelsa-sand/50' : ''}`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Info */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                className={`space-y-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4">
                  <span className="font-display text-4xl font-semibold text-excelsa-sand2">{num}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-excelsa-navy text-excelsa-cream">
                    <Icon size={20} />
                  </div>
                </motion.div>
                <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
                  {titulo}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] text-excelsa-clay">
                  {subtitulo}
                </motion.p>
                <motion.p variants={fadeUp} className="text-lg leading-relaxed text-excelsa-ink/70">
                  {desc}
                </motion.p>
                <motion.div variants={fadeUp} className="pt-1">
                  <Link href={WHATSAPP_LINK} target="_blank" className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-navy px-7 py-3.5 text-sm font-bold text-excelsa-cream transition-all hover:bg-excelsa-clay">
                    Consultar sobre este servicio
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Detalles */}
              <div className={`space-y-5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                {items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="rounded-2xl border border-excelsa-sand2/80 bg-white p-7 transition-colors hover:border-excelsa-clay/40"
                  >
                    <h4 className="font-display text-lg font-medium text-excelsa-navy">{item.t}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-excelsa-ink/65">{item.d}</p>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="rounded-2xl border border-excelsa-clay/25 bg-excelsa-claysoft/25 p-7"
                >
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-excelsa-clay">
                    Entregables concretos
                  </p>
                  <div className="space-y-2.5">
                    {entregables.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm font-medium text-excelsa-ink/80">
                        <Check size={15} className="shrink-0 text-excelsa-clay" />
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
      <section className="relative overflow-hidden bg-excelsa-navy py-24 lg:py-32">
        <ContourBg tone="navy" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-5">
              <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
                Metodología
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-cream lg:text-5xl">
                Cómo trabajamos.
              </motion.h2>
              <motion.p variants={fadeUp} className="max-w-md text-lg leading-relaxed text-excelsa-cream/60">
                Un proceso estructurado en cuatro etapas que garantiza resultados medibles en cada proyecto.
              </motion.p>
            </motion.div>
            <div>
              {PROCESO.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.65 }}
                  className="group flex gap-7 border-b border-white/10 py-8 last:border-0"
                >
                  <span className="font-display text-3xl font-semibold text-white/15 transition-colors group-hover:text-excelsa-clay">{p.n}</span>
                  <div>
                    <h4 className="font-display text-xl font-medium text-excelsa-cream">{p.t}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-excelsa-cream/55">{p.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
            ¿Qué servicio necesita tu empresa?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-excelsa-ink/65">
            Hacemos un diagnóstico sin cargo para entender tu situación y recomendarte el camino más adecuado.
          </p>
          <div className="mt-8">
            <Link href="/contacto" className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-navy px-9 py-4 text-sm font-bold text-excelsa-cream shadow-xl shadow-excelsa-navy/20 transition-all hover:bg-excelsa-clay">
              Solicitar diagnóstico gratuito
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
