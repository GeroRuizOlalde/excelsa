"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Globe, BarChart3, Zap, Target, Quote } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import PageHero from '@/components/PageHero';
import ContourBg from '@/components/ContourBg';
import { WHATSAPP_LINK } from '@/lib/constants';
import { fadeUp, stagger } from '@/lib/motion';

const STATS = [
  { value: "200+", label: "Empresas acompañadas" },
  { value: "15+",  label: "Años de trayectoria" },
  { value: "98%",  label: "Retención de clientes" },
  { value: "3×",   label: "Crecimiento promedio" },
];

const SECTORES = [
  { Icon: Building2, label: "Construcción e Infraestructura", desc: "Empresas constructoras, inmobiliarias y desarrolladoras de obra pública y privada." },
  { Icon: Layers,    label: "Manufactura e Industria",         desc: "Plantas industriales, fábricas y empresas de producción regional." },
  { Icon: Globe,     label: "Agroindustria y Exportación",     desc: "Bodegas, empacadoras, cooperativas y exportadores de productos regionales." },
  { Icon: BarChart3, label: "Comercio y Distribución",         desc: "Comercios mayoristas, distribuidores y cadenas de retail locales." },
  { Icon: Zap,       label: "Tecnología y Servicios",          desc: "Startups, agencias, consultoras y empresas de servicios profesionales." },
  { Icon: Target,    label: "Desarrollos Inmobiliarios",       desc: "Fideicomisos, inversores y desarrolladoras residenciales y comerciales." },
];

const TESTIMONIOS = [
  { quote: "Lograron lo que otras consultoras no pudieron: que mi equipo adopte los procesos. La visión integrada es su gran valor.", autor: "Directora Industrial", org: "Industria manufacturera · San Juan" },
  { quote: "Profesionalismo y cercanía. Excelsa nos dio el orden administrativo que necesitábamos para poder exportar y escalar.",      autor: "Socio Gerente",       org: "Empresa constructora · Cuyo" },
  { quote: "El diagnóstico inicial nos abrió los ojos. En seis meses redujimos costos y triplicamos el control sobre el negocio.",        autor: "Gerente General",     org: "Distribuidora regional · San Juan" },
  { quote: "Por primera vez entendemos realmente la rentabilidad de cada línea. Transformaron la forma en que tomamos decisiones.",       autor: "Dueño",               org: "Comercio mayorista · Cuyo" },
];

export default function CasosPage() {
  return (
    <div className="min-h-screen bg-excelsa-cream font-body text-excelsa-ink antialiased">
      <NavbarPublic />

      <PageHero
        eyebrow="Casos"
        title="Empresas que ya están subiendo con nosotros."
        subtitle="Resultados reales en industrias diversas a lo largo de toda la región de Cuyo."
      />

      {/* ── STATS ── */}
      <section className="relative overflow-hidden bg-excelsa-navy py-16">
        <ContourBg tone="navy" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 lg:grid-cols-4 lg:px-10">
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

      {/* ── SECTORES ── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14 max-w-xl space-y-4">
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Industrias
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Experiencia transversal en todos los sectores.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SECTORES.map(({ Icon, label, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group flex gap-5 rounded-2xl border border-excelsa-sand2/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-excelsa-clay/40 hover:shadow-xl hover:shadow-excelsa-navy/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-excelsa-claysoft/40 text-excelsa-clay transition-colors group-hover:bg-excelsa-clay group-hover:text-white">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-excelsa-navy">{label}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-excelsa-ink/65">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="bg-excelsa-sand/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14 max-w-xl space-y-4">
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Testimonios
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Lo que dicen quienes confían en Excelsa.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {TESTIMONIOS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="rounded-[1.5rem] border border-excelsa-sand2/80 bg-white p-9"
              >
                <Quote size={30} className="text-excelsa-clay/50" />
                <p className="mt-5 text-lg leading-relaxed text-excelsa-ink/80">{t.quote}</p>
                <div className="mt-6 flex items-center gap-4 border-t border-excelsa-sand2/70 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-excelsa-navy font-display text-base font-semibold text-excelsa-cream">
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

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-excelsa-navy py-24 lg:py-28">
        <ContourBg tone="navy" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-cream lg:text-5xl">
            Tu empresa puede ser el próximo caso de éxito.
          </h2>
          <div className="mt-9">
            <Link href={WHATSAPP_LINK} target="_blank" className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-clay px-9 py-4 text-sm font-bold text-white transition-all hover:bg-white hover:text-excelsa-navy">
              Hablemos <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
