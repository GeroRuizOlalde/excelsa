"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowRight, MessageCircle, Building2, Settings, TrendingUp,
  Clock, UserCheck, PieChart, Boxes, Compass, Rocket, Quote, Mountain,
} from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import ContourBg from '@/components/ContourBg';
import { WHATSAPP_LINK } from '@/lib/constants';
import { fadeUp, stagger, staggerFast } from '@/lib/motion';

// ─── DATOS ──────────────────────────────────────────────────────────────────
const STATS = [
  { value: "+200",   label: "Empresas auditadas" },
  { value: "1.500+", label: "Operarios bajo gestión de nómina" },
  { value: "15",     label: "Años de trayectoria en Cuyo" },
  { value: "98%",    label: "Retención de clientes" },
];

// Dolores reales del dueño / directivo — la sección que genera identificación.
const PROBLEMAS = [
  { Icon: Clock,     texto: "Trabajás más que nunca, pero la rentabilidad no aparece por ningún lado." },
  { Icon: UserCheck, texto: "Todo pasa por vos. Si no estás una semana, la empresa se frena." },
  { Icon: PieChart,  texto: "No sabés con certeza qué línea de negocio gana y cuál te hace perder plata." },
  { Icon: Boxes,     texto: "Crecés, sí. Pero el desorden crece más rápido que las ventas." },
  { Icon: Compass,   texto: "Tomás decisiones importantes a pura intuición, sin números que las respalden." },
  { Icon: Rocket,    texto: "Sabés que podés escalar, pero no tenés claro por dónde empezar." },
];

const SERVICIOS = [
  {
    num: "01", Icon: Building2,
    titulo: "Soluciones Empresariales",
    desc: "Ordenamos la base financiera, legal y administrativa para que tu empresa crezca sobre cimientos firmes.",
    items: ["Contabilidad e Impuestos", "Asesoría Legal", "Administración y Finanzas"],
  },
  {
    num: "02", Icon: Settings,
    titulo: "Gestión y Estrategia",
    desc: "Traducimos los objetivos del negocio en procesos concretos, tableros de control y equipos que saben qué hacer.",
    items: ["Planificación Estratégica OKR", "Logística y Operaciones", "Gestión de Procesos"],
  },
  {
    num: "03", Icon: TrendingUp,
    titulo: "Crecimiento Sostenible",
    desc: "Diseñamos estrategia comercial, marca y propósito para un crecimiento que se sostiene en el tiempo.",
    items: ["Comercialización y Marca", "Desarrollo de Producto", "Sostenibilidad (ODS)"],
  },
];

// Logos de clientes. Reemplazá cada item por { nombre, logo: "/clientes/archivo.png" }
// cuando tengas los logos: el componente usa la imagen automáticamente si existe.
const CLIENTES: { nombre: string; logo?: string }[] = [
  { nombre: "Constructora Andina" },
  { nombre: "Bodega del Sol" },
  { nombre: "Grupo Cuyo" },
  { nombre: "Agro Pampa" },
  { nombre: "Distribuidora Norte" },
  { nombre: "Industrias Zonda" },
  { nombre: "Inmobiliaria Cima" },
  { nombre: "Tecno Sur" },
];

// Testimonios. Sumá nombre real, empresa y foto cuando los tengas.
const TESTIMONIOS = [
  {
    quote: "Lograron lo que otras consultoras no pudieron: que mi equipo adopte los procesos. La mirada integrada es su gran valor.",
    autor: "Directora Industrial", org: "Industria manufacturera · San Juan",
  },
  {
    quote: "Nos dieron el orden administrativo que necesitábamos para poder exportar y escalar. Profesionalismo y cercanía.",
    autor: "Socio Gerente", org: "Empresa constructora · Cuyo",
  },
  {
    quote: "En seis meses redujimos costos y triplicamos el control sobre el negocio. El diagnóstico inicial nos abrió los ojos.",
    autor: "Gerente General", org: "Distribuidora regional · San Juan",
  },
];

// ─── PÁGINA ─────────────────────────────────────────────────────────────────
export default function LandingExcelsa() {
  return (
    <div className="min-h-screen bg-excelsa-cream font-body text-excelsa-ink antialiased">

      {/* WhatsApp flotante */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-7 right-7 z-[60]"
      >
        <Link
          href={WHATSAPP_LINK} target="_blank"
          className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3.5 font-semibold text-sm text-white shadow-2xl shadow-green-600/30 transition-transform hover:scale-105"
        >
          <MessageCircle size={20} />
          <span className="hidden md:block">¿Hablamos?</span>
        </Link>
      </motion.div>

      <NavbarPublic />

      {/* ══════════ HERO ══════════ */}
      <section className="texture-grain relative overflow-hidden bg-excelsa-cream pb-20 pt-32 lg:pb-28 lg:pt-40">
        <ContourBg tone="cream" />
        {/* halo cálido */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-excelsa-claysoft/40 blur-[130px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10">
          {/* Texto */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full border border-excelsa-navy/15 bg-white/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-navy"
            >
              <Mountain size={13} className="text-excelsa-clay" />
              Consultoría empresarial · San Juan
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-display text-[2.9rem] font-medium leading-[1.02] tracking-[-0.02em] text-excelsa-navy sm:text-6xl lg:text-[4.6rem]"
            >
              Estructuramos, auditamos
              <br />
              y <span className="italic text-excelsa-clay brush-underline">escalamos empresas</span> en&nbsp;Cuyo.
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-excelsa-ink/70">
              Unimos dirección financiera, legal y estratégica en una sola alianza.
              No entregamos informes que duermen en un cajón: acompañamos la implementación
              real, hasta ver los resultados.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <a
                href="#servicios"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-excelsa-navy px-8 py-4 text-sm font-bold text-excelsa-cream shadow-xl shadow-excelsa-navy/20 transition-all hover:bg-excelsa-clay"
              >
                Ver Soluciones Empresariales
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/mineria"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-excelsa-clay/50 px-8 py-4 text-sm font-bold text-excelsa-navy transition-all hover:border-excelsa-clay hover:bg-excelsa-clay/10"
              >
                <Mountain size={15} className="text-excelsa-clay" />
                Especialistas en Sector Minero
              </Link>
            </motion.div>

          </motion.div>

          {/* Imagen — LCP optimizado con next/image priority */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative"
          >
            {/* marco terracota detrás */}
            <div className="absolute -bottom-5 -right-5 h-full w-full rounded-[2rem] border-2 border-excelsa-clay/40" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-excelsa-navy/20">
              <Image
                src="/DSC_4808.JPG"
                alt="Equipo Excelsa en reunión de consultoría empresarial"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-excelsa-navy/30 to-transparent" />
            </div>
            {/* tarjeta flotante */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="absolute -bottom-7 -left-5 rounded-2xl border border-excelsa-sand2 bg-white/95 px-6 py-5 shadow-xl backdrop-blur"
            >
              <div className="font-display text-3xl font-semibold text-excelsa-navy">+200</div>
              <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-excelsa-ink/50">
                Empresas auditadas
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ LOGOS CLIENTES ══════════ */}
      <section className="border-y border-excelsa-sand2/70 bg-excelsa-sand/50 py-10">
        <p className="mb-7 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-ink/40">
          Empresas que ya confían en Excelsa
        </p>
        <div className="marquee-pause relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee-slow items-center gap-14 pr-14">
            {[...CLIENTES, ...CLIENTES].map((c, i) => (
              <ClienteLogo key={i} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ¿TE SUENA FAMILIAR? ══════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="mb-14 max-w-2xl"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              ¿Te suena familiar?
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Si dirigís una empresa, probablemente convivís con esto.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerFast}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {PROBLEMAS.map(({ Icon, texto }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group flex gap-5 rounded-2xl border border-excelsa-sand2/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-excelsa-clay/40 hover:shadow-xl hover:shadow-excelsa-navy/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-excelsa-claysoft/40 text-excelsa-clay transition-colors group-hover:bg-excelsa-clay group-hover:text-white">
                  <Icon size={20} />
                </div>
                <p className="text-[15px] font-medium leading-relaxed text-excelsa-ink/80">{texto}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 flex flex-col items-start gap-5 rounded-2xl bg-excelsa-navy px-8 py-7 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="font-display text-xl text-excelsa-cream sm:text-2xl">
              Si asentiste al menos una vez, estás en el lugar correcto.
            </p>
            <Link
              href="/contacto"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-excelsa-clay px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-excelsa-navy"
            >
              Quiero ordenarlo
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ SERVICIOS ══════════ */}
      <section id="servicios" className="texture-grain relative bg-excelsa-sand/50 py-24 lg:py-32 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-xl space-y-4">
              <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
                Cómo te ayudamos
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
                Tres frentes, una sola dirección.
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/servicios" className="group inline-flex items-center gap-2 text-sm font-bold text-excelsa-navy hover:text-excelsa-clay">
                Ver todo en detalle
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SERVICIOS.map(({ num, Icon, titulo, desc, items }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-excelsa-sand2/80 bg-white p-9 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-excelsa-navy/8"
              >
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-display text-5xl font-semibold text-excelsa-sand2 transition-colors group-hover:text-excelsa-claysoft">{num}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-excelsa-navy text-excelsa-cream transition-colors group-hover:bg-excelsa-clay">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="font-display text-2xl font-medium tracking-tight text-excelsa-navy">{titulo}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-excelsa-ink/65">{desc}</p>
                <div className="mt-6 space-y-2.5 border-t border-excelsa-sand2/70 pt-6">
                  {items.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-excelsa-ink/75">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-excelsa-clay" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SECCIÓN PUENTE — COMPLIANCE MINERO ══════════ */}
      <section className="relative overflow-hidden bg-excelsa-navy py-20 lg:py-24">
        <ContourBg tone="navy" />
        {/* Halo terracota sutil */}
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[400px] w-[600px] -translate-y-1/2 rounded-full bg-excelsa-clay/8 blur-[120px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center lg:flex-row lg:gap-16 lg:px-10 lg:text-left"
        >
          {/* Icono / visual */}
          <motion.div
            variants={fadeUp}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <Mountain size={36} className="text-excelsa-clay" />
          </motion.div>

          {/* Copy */}
          <motion.div variants={fadeUp} className="max-w-2xl space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Compliance Minero
            </span>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.02em] text-excelsa-cream lg:text-4xl">
              La industria minera exige otro nivel de rigurosidad.
            </h2>
            <p className="text-base leading-relaxed text-excelsa-cream/65">
              Conozca nuestro servicio de Due Diligence, Control de Contratistas
              y adecuación a la Ley&nbsp;2827&#8209;M.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="shrink-0">
            <Link
              href="/mineria"
              className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-clay px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-excelsa-clay/25 transition-all hover:bg-white hover:text-excelsa-navy"
            >
              Ir a Compliance Minero
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ NOSOTROS TEASER ══════════ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] bg-excelsa-claysoft/30" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-2xl shadow-excelsa-navy/20">
              {/* Foto de equipo/oficina */}
              <Image
                src="/DSC_4789.JPG"
                alt="Equipo Excelsa trabajando en consultoría"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[25%_center]"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
            className="order-1 space-y-7 lg:order-2"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Quiénes somos
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-[3.25rem]">
              Una consultora de cercanía, con estándares de clase mundial.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-excelsa-ink/70">
              Nacimos en San Juan convencidos de que las empresas de la región merecen el mismo
              nivel de acompañamiento que las grandes corporaciones. Aportamos una mirada 360°:
              desde la operación diaria hasta la estrategia de largo plazo.
            </motion.p>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-excelsa-sand2 pt-7">
              {[
                ["Compromiso real", "Nos quedamos hasta ver resultados."],
                ["Visión 360°", "Operación, finanzas, legal y estrategia."],
                ["Ejecución concreta", "Responsables, plazos y métricas."],
                ["Innovación aplicada", "Metodologías adaptadas a tu realidad."],
              ].map(([t, d]) => (
                <div key={t}>
                  <div className="font-display text-lg font-semibold text-excelsa-navy">{t}</div>
                  <div className="mt-1 text-sm leading-snug text-excelsa-ink/55">{d}</div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link href="/nosotros" className="group inline-flex items-center gap-2 text-sm font-bold text-excelsa-navy hover:text-excelsa-clay">
                Conocé al equipo
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ STATS (banda navy) ══════════ */}
      <section className="relative overflow-hidden bg-excelsa-navy py-20">
        <ContourBg tone="navy" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-6 lg:grid-cols-4 lg:px-10">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center lg:border-r lg:border-white/10 lg:last:border-0"
            >
              <div className="font-display text-5xl font-semibold text-excelsa-cream lg:text-6xl">{s.value}</div>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-cream/55">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ TESTIMONIOS ══════════ */}
      <section className="bg-excelsa-sand/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-14 max-w-xl space-y-4"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Lo que dicen
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Resultados que nuestros clientes cuentan mejor que nosotros.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIOS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="flex flex-col rounded-[1.5rem] border border-excelsa-sand2/80 bg-white p-8"
              >
                <Quote size={28} className="text-excelsa-clay/50" />
                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-excelsa-ink/80">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-excelsa-sand2/70 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-excelsa-navy font-display text-sm font-semibold text-excelsa-cream">
                    {t.autor.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-excelsa-navy">{t.autor}</div>
                    <div className="text-[11px] uppercase tracking-wider text-excelsa-ink/45">{t.org}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="relative overflow-hidden bg-excelsa-navy py-28 lg:py-36">
        <ContourBg tone="navy" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-excelsa-clay/12 blur-[120px]" />
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <motion.div variants={fadeUp} className="mb-7 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logoblanco.png" alt="" className="h-12 w-auto opacity-90" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-cream lg:text-6xl">
            El primer paso es una conversación.
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-excelsa-cream/65">
            Hacemos un diagnóstico sin cargo: conversamos sobre tu empresa, identificamos
            oportunidades y diseñamos juntos el camino a la cima.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-clay px-9 py-4 text-sm font-bold text-white shadow-2xl shadow-excelsa-clay/25 transition-all hover:bg-white hover:text-excelsa-navy"
            >
              Solicitar diagnóstico gratuito
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-excelsa-cream transition-all hover:border-white/50 hover:bg-white/5"
            >
              Acceso clientes
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <FooterPublic />
    </div>
  );
}

// Logo de cliente: usa imagen si está disponible, si no un logotipo tipográfico elegante.
function ClienteLogo({ nombre, logo }: { nombre: string; logo?: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt={nombre} className="h-9 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />;
  }
  return (
    <span className="whitespace-nowrap font-display text-xl font-semibold tracking-tight text-excelsa-navy/35 transition-colors hover:text-excelsa-navy/70">
      {nombre}
    </span>
  );
}
