"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, Wind, Lightbulb, Network, BarChart3, GraduationCap,
  ArrowRight, MessageCircle, ArrowUpRight, CheckCheck,
} from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import ContourBg from '@/components/ContourBg';
import { WHATSAPP_LINK } from '@/lib/constants';
import { fadeUp, stagger, staggerFast } from '@/lib/motion';

// ─── WHATSAPP CTA ESPECÍFICO ─────────────────────────────────────────────────
const WHATSAPP_CULTURA =
  "https://wa.me/5492646721545?text=" +
  encodeURIComponent(
    "Hola Excelsa, me interesa hablar con un especialista en Personas y Cultura Organizacional para mi empresa."
  );

// ─── DATOS ───────────────────────────────────────────────────────────────────
const PILARES = [
  {
    Icon: Users,
    titulo: "Gestión Estratégica de RRHH",
    desc: "Diagnóstico del área, diseño de políticas, organigramas funcionales y organización interna para que el área de personas opere de forma profesional.",
    color: "bg-excelsa-navy",
    span: "md:col-span-2",
  },
  {
    Icon: Wind,
    titulo: "Clima Laboral y Cultura",
    desc: "Encuestas de clima, identificación de valores organizacionales, plan de motivación y construcción de una cultura alineada al negocio.",
    color: "bg-excelsa-clay",
    span: "",
  },
  {
    Icon: Lightbulb,
    titulo: "Liderazgo y Equipos",
    desc: "Desarrollo de mandos medios, comunicación efectiva, gestión de conflictos y construcción de equipos de alto rendimiento.",
    color: "bg-excelsa-navy",
    span: "",
  },
  {
    Icon: Network,
    titulo: "Estructura Organizacional",
    desc: "Rediseño de organigramas, definición de roles y responsabilidades, descripciones de puestos claras y alineadas a la estrategia.",
    color: "bg-excelsa-clay",
    span: "",
  },
  {
    Icon: BarChart3,
    titulo: "Evaluación de Desempeño",
    desc: "Sistemas de objetivos, evaluación por competencias, feedback continuo y planes de mejora individualizados para cada colaborador.",
    color: "bg-excelsa-navy",
    span: "",
  },
  {
    Icon: GraduationCap,
    titulo: "Capacitación y Desarrollo",
    desc: "Talleres y programas de formación adaptados a las necesidades concretas de la empresa, con impacto medible en la operación.",
    color: "bg-excelsa-clay",
    span: "md:col-span-2",
  },
];

const METODOLOGIA = [
  {
    step: "01",
    label: "Diagnosticar",
    desc: "Encuestas, entrevistas y análisis del estado actual.",
  },
  {
    step: "02",
    label: "Diseñar",
    desc: "Plan personalizado con objetivos claros y plazos concretos.",
  },
  {
    step: "03",
    label: "Implementar",
    desc: "Ejecución acompañada, sin dejar solo al equipo.",
  },
  {
    step: "04",
    label: "Acompañar",
    desc: "Seguimiento continuo para que los cambios se consoliden.",
  },
  {
    step: "05",
    label: "Medir",
    desc: "Indicadores de impacto para decisiones basadas en datos.",
  },
];

// ─── PÁGINA ──────────────────────────────────────────────────────────────────
export default function CulturaPage() {
  return (
    <div className="min-h-screen bg-excelsa-cream font-body text-excelsa-ink antialiased">

      {/* WhatsApp flotante */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-7 right-7 z-[60]"
      >
        <Link
          href={WHATSAPP_CULTURA}
          target="_blank"
          className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3.5 font-semibold text-sm text-white shadow-2xl shadow-green-600/30 transition-transform hover:scale-105"
        >
          <MessageCircle size={20} />
          <span className="hidden md:block">¿Hablamos?</span>
        </Link>
      </motion.div>

      <NavbarPublic />

      {/* ══════════ HERO ══════════ */}
      <section className="texture-grain relative overflow-hidden bg-excelsa-cream pb-20 pt-32 lg:pb-28 lg:pt-44">
        <ContourBg tone="cream" />
        {/* halo cálido */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-excelsa-claysoft/50 blur-[130px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[500px] rounded-full bg-excelsa-sand/70 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full border border-excelsa-navy/15 bg-white/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-navy backdrop-blur"
            >
              <Users size={13} className="text-excelsa-clay" />
              Capital Humano
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-display text-[2.7rem] font-medium leading-[1.04] tracking-[-0.025em] text-excelsa-navy sm:text-6xl lg:text-[4.5rem]"
            >
              Las empresas crecen cuando{" "}
              <span className="italic text-excelsa-clay brush-underline">
                sus equipos crecen con ellas.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-excelsa-ink/68"
            >
              Acompañamos a las empresas a ordenar su estructura, fortalecer sus
              equipos y desarrollar una cultura alineada con los objetivos del
              negocio.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row"
            >
              <Link
                href={WHATSAPP_CULTURA}
                target="_blank"
                className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-navy px-8 py-4 text-sm font-bold text-excelsa-cream shadow-xl shadow-excelsa-navy/20 transition-all hover:bg-excelsa-clay"
              >
                Hablar con un especialista
                <MessageCircle size={16} className="transition-transform group-hover:scale-110" />
              </Link>
              <Link
                href="#soluciones"
                className="inline-flex items-center gap-2 rounded-full border border-excelsa-clay/40 px-8 py-4 text-sm font-bold text-excelsa-navy transition-all hover:border-excelsa-clay hover:bg-excelsa-clay/10"
              >
                Ver soluciones
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Chips de capacidades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {[
              "Diagnóstico de clima",
              "Evaluación 360°",
              "Planes de carrera",
              "Cultura organizacional",
              "Descripción de puestos",
              "Capacitación in-company",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-excelsa-sand2 bg-white/70 px-4 py-1.5 text-[12px] font-semibold text-excelsa-ink/65 backdrop-blur"
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ BENTO GRID SOLUCIONES ══════════ */}
      <section
        id="soluciones"
        className="texture-grain relative bg-excelsa-sand/50 py-24 scroll-mt-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-14 max-w-2xl space-y-4"
          >
            <motion.span
              variants={fadeUp}
              className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay"
            >
              Nuestras Soluciones
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl"
            >
              Seis pilares para una organización que funciona.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base leading-relaxed text-excelsa-ink/65">
              Cada intervención es diseñada a medida. No hay recetas genéricas: trabajamos
              desde el diagnóstico real de su empresa.
            </motion.p>
          </motion.div>

          {/* Bento grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerFast}
            className="grid grid-cols-1 gap-4 md:grid-cols-4"
          >
            {PILARES.map(({ Icon, titulo, desc, color, span }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-excelsa-sand2/60 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-excelsa-navy/8 ${span}`}
              >
                {/* Dot decorativo */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-excelsa-sand opacity-50 transition-all duration-500 group-hover:opacity-80" />

                <div
                  className={`relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="relative z-10 font-display text-xl font-semibold leading-snug tracking-tight text-excelsa-navy">
                  {titulo}
                </h3>
                <p className="relative z-10 mt-3 flex-1 text-[14px] leading-relaxed text-excelsa-ink/65">
                  {desc}
                </p>
                <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-excelsa-clay opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <CheckCheck size={14} />
                  Incluido en nuestro servicio
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ METODOLOGÍA (STEPPER) ══════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto]"
          >
            <div className="max-w-xl space-y-4">
              <motion.span
                variants={fadeUp}
                className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay"
              >
                Nuestra Metodología
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl"
              >
                Cinco pasos que generan cambio real.
              </motion.h2>
            </div>
            <motion.blockquote
              variants={fadeUp}
              className="max-w-xs self-end border-l-2 border-excelsa-clay pl-5"
            >
              <p className="text-[15px] italic leading-relaxed text-excelsa-ink/70">
                "Medir el clima es el punto de partida. Lo importante es qué hacemos
                con esa información."
              </p>
            </motion.blockquote>
          </motion.div>

          {/* Stepper horizontal en desktop, vertical en mobile */}
          <div className="relative">
            {/* Línea conectora — visible solo en desktop */}
            <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-excelsa-sand2 to-transparent lg:block" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerFast}
              className="grid grid-cols-1 gap-8 lg:grid-cols-5"
            >
              {METODOLOGIA.map(({ step, label, desc }, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group relative flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                  {/* Número / nodo */}
                  <div className="relative z-10 flex h-18 w-18 items-center justify-center rounded-full border-2 border-excelsa-sand2 bg-white shadow-lg shadow-excelsa-navy/6 transition-all duration-300 group-hover:border-excelsa-clay group-hover:shadow-excelsa-clay/15">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-excelsa-navy text-excelsa-cream transition-colors duration-300 group-hover:bg-excelsa-clay">
                      <span className="font-display text-lg font-semibold">{step}</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-1.5">
                    <div className="font-display text-lg font-semibold text-excelsa-navy transition-colors duration-200 group-hover:text-excelsa-clay">
                      {label}
                    </div>
                    <p className="text-[13px] leading-relaxed text-excelsa-ink/60">{desc}</p>
                  </div>

                  {/* Flecha — solo entre pasos, no en mobile */}
                  {i < METODOLOGIA.length - 1 && (
                    <div className="absolute -right-5 top-8 hidden text-excelsa-sand2 lg:block">
                      <ArrowRight size={18} />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ SECCIÓN CIERRE (BANNER) ══════════ */}
      <section className="relative overflow-hidden bg-excelsa-navy py-28 lg:py-36">
        <ContourBg tone="navy" />
        {/* Halos */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-excelsa-clay/10 blur-[140px]" />
        <div className="pointer-events-none absolute -left-20 top-0 h-[300px] w-[400px] rounded-full bg-excelsa-claysoft/5 blur-[80px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-10"
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-clay backdrop-blur">
              <Users size={13} />
              Capital Humano · Excelsa
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-medium leading-tight tracking-[-0.025em] text-excelsa-cream sm:text-4xl lg:text-5xl"
          >
            Profesionalizar una empresa no significa{" "}
            <span className="italic text-excelsa-clay">
              solamente ordenar sus procesos.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-excelsa-cream/65"
          >
            Significa construir una organización capaz de crecer y sostener ese
            crecimiento. Empezamos por las personas.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href={WHATSAPP_CULTURA}
              target="_blank"
              className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-clay px-9 py-4 text-sm font-bold text-white shadow-2xl shadow-excelsa-clay/25 transition-all hover:bg-white hover:text-excelsa-navy"
            >
              Agendar una reunión
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href={WHATSAPP_LINK}
              target="_blank"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-excelsa-cream transition-all hover:border-white/50 hover:bg-white/5"
            >
              <MessageCircle size={16} />
              Hablar por WhatsApp
            </Link>
          </motion.div>

          {/* Micro-proof */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-10"
          >
            {[
              ["15+", "Años de experiencia"],
              ["+200", "Empresas acompañadas"],
              ["98%", "Retención de clientes"],
            ].map(([val, lab]) => (
              <div key={lab} className="text-center">
                <div className="font-display text-3xl font-semibold text-excelsa-cream">{val}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-excelsa-cream/45">{lab}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <FooterPublic />
    </div>
  );
}
