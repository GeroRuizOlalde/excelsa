"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Globe, Target, Zap } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import PageHero from '@/components/PageHero';
import ContourBg from '@/components/ContourBg';
import { WHATSAPP_LINK } from '@/lib/constants';
import { fadeUp, stagger } from '@/lib/motion';

// ─── EQUIPO ──────────────────────────────────────────────────────────────────
// Actualizá foto, cargo y descripción cuando lleguen los datos.
const EQUIPO = [
  {
    nombre: "Gema Zavalla",
    cargo:  "Socia Fundadora · Dirección Estratégica",
    desc:   "Especialista en planificación estratégica, finanzas corporativas y desarrollo organizacional.",
    foto:   "/DSC_4754.JPG",
    inicial: "G",
  },
  {
    nombre: "Leticia García",
    cargo:  "Socia Fundadora · Consultoría Operativa",
    desc:   "Experta en gestión de procesos, logística, administración y acompañamiento ejecutivo.",
    foto:   "/DSC_4741.JPG",
    inicial: "L",
  },
];

const VALORES = [
  { Icon: Shield, titulo: "Compromiso real",     desc: "Nos involucramos hasta ver los resultados. Sin excusas ni informes sin acción." },
  { Icon: Globe,  titulo: "Visión 360°",         desc: "Integramos operación, estrategia, finanzas y legal en una sola mirada." },
  { Icon: Target, titulo: "Ejecución concreta",  desc: "Cada plan tiene responsables, plazos y métricas. Nada queda en el papel." },
  { Icon: Zap,    titulo: "Innovación aplicada", desc: "Metodologías de clase mundial adaptadas a la realidad de cada empresa." },
];

const PILARES = [
  { n: "01", t: "Estructura", d: "Cada organización necesita bases sólidas antes de crecer. Construimos los cimientos operativos, legales y financieros." },
  { n: "02", t: "Visión",     d: "Sin una dirección clara, la energía se dispersa. Definimos objetivos y hojas de ruta que el equipo adopta." },
  { n: "03", t: "Ejecución",  d: "La diferencia está en hacer. Acompañamos a los equipos en la trinchera hasta que los procesos funcionan solos." },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-excelsa-cream font-body text-excelsa-ink antialiased">
      <NavbarPublic />

      <PageHero
        eyebrow="Nosotros"
        title="Las personas que empujan tu empresa hacia arriba."
        subtitle="Un equipo comprometido con la transformación real de las organizaciones de la región."
      />

      {/* ── HISTORIA ── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-7">
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Nuestra historia
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Nacimos para hacer lo que otros no hacen: implementar.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-excelsa-ink/70">
              Excelsa nació en San Juan de la convicción de que las empresas de la región merecen el
              mismo nivel de acompañamiento estratégico que las grandes corporaciones del mundo.
              No como un lujo, sino como una herramienta concreta de crecimiento.
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-excelsa-ink/70">
              A lo largo de los años construimos una metodología propia: diagnóstico profundo, plan
              concreto, implementación acompañada y medición rigurosa. El resultado es predecible
              cuando el proceso es serio.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/contacto" className="group inline-flex items-center gap-2 text-sm font-bold text-excelsa-navy hover:text-excelsa-clay">
                Trabajá con nosotros
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="space-y-5">
            {PILARES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-6 rounded-2xl border border-excelsa-sand2/80 bg-white p-7 transition-colors hover:border-excelsa-clay/40"
              >
                <span className="font-display text-3xl font-semibold text-excelsa-sand2">{p.n}</span>
                <div>
                  <h4 className="font-display text-xl font-medium text-excelsa-navy">{p.t}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-excelsa-ink/65">{p.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOTO GRUPAL ── */}
      <section className="bg-excelsa-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-2xl shadow-excelsa-navy/15 md:aspect-[2/1]"
          >
            <img src="/DSC_4794.JPG" alt="Equipo Excelsa" className="h-full w-full object-cover object-[center_30%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-excelsa-navy/25 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14 max-w-xl space-y-4">
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Nuestro equipo
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Las personas detrás de Excelsa.
            </motion.h2>
          </motion.div>

          <div className="space-y-16 lg:space-y-24">
            {EQUIPO.map(({ nombre, cargo, desc, foto, inicial }, i) => {
              const fotoDerecha = i % 2 === 1; // alterna: par = foto izq, impar = foto der
              return (
                <div key={i} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
                  {/* Foto */}
                  <motion.div
                    initial={{ opacity: 0, x: fotoDerecha ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8 }}
                    className={`relative ${fotoDerecha ? 'lg:order-2' : 'lg:order-1'}`}
                  >
                    <div className={`absolute -bottom-4 h-full w-full rounded-[2rem] bg-excelsa-claysoft/30 ${fotoDerecha ? '-right-4' : '-left-4'}`} />
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-excelsa-sand2 shadow-2xl shadow-excelsa-navy/15">
                      {foto ? (
                        <img src={foto} alt={nombre} className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-excelsa-navy font-display text-[8rem] font-semibold text-excelsa-claysoft">
                          {inicial}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Info */}
                  <motion.div
                    initial={{ opacity: 0, x: fotoDerecha ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`space-y-5 ${fotoDerecha ? 'lg:order-1' : 'lg:order-2'}`}
                  >
                    <span className="block h-px w-12 bg-excelsa-clay" />
                    <div className="space-y-2">
                      <h3 className="font-display text-3xl font-medium tracking-tight text-excelsa-navy lg:text-4xl">{nombre}</h3>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-clay">{cargo}</p>
                    </div>
                    <p className="max-w-md text-lg leading-relaxed text-excelsa-ink/70">{desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className="bg-excelsa-sand/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14 max-w-xl space-y-4">
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Filosofía
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Los valores que guían cada proyecto.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALORES.map(({ Icon, titulo, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group rounded-2xl border border-excelsa-sand2/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-excelsa-navy/5"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-excelsa-navy text-excelsa-cream transition-colors group-hover:bg-excelsa-clay">
                  <Icon size={18} />
                </div>
                <h4 className="font-display text-lg font-medium text-excelsa-navy">{titulo}</h4>
                <p className="mt-2 text-sm leading-relaxed text-excelsa-ink/65">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-excelsa-navy py-24 lg:py-28">
        <ContourBg tone="navy" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-cream lg:text-5xl">
            ¿Listo para transformar tu empresa?
          </h2>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={WHATSAPP_LINK} target="_blank" className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-clay px-9 py-4 text-sm font-bold text-white transition-all hover:bg-white hover:text-excelsa-navy">
              Hablemos <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/servicios" className="inline-flex items-center rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-excelsa-cream transition-all hover:border-white/50 hover:bg-white/5">
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
