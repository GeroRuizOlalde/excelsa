"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, FileCheck, AlertTriangle, HardHat, Factory,
  ChevronDown, Download, MessageCircle, ArrowUpRight, ArrowRight,
  CheckCircle2, CircleAlert, XCircle, ClipboardCheck, Mountain,
  X, Loader2, Building2, Scale,
} from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import ContourBg from '@/components/ContourBg';
import { WHATSAPP_LINK } from '@/lib/constants';
import { fadeUp, stagger, staggerFast } from '@/lib/motion';


// ─── DATOS ──────────────────────────────────────────────────────────────────

const WHATSAPP_MINERIA_PYME =
  "https://wa.me/5492646721545?text=" +
  encodeURIComponent(
    "Hola Excelsa, soy proveedor minero y necesito adecuarme a la Ley 2827-M / RE.PRO.MIN. con urgencia. Quisiera coordinar una reunión esta semana."
  );

const SEMAFORO = [
  {
    color: "verde" as const,
    label: "Apto",
    Icon: CheckCircle2,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
    accent: "bg-emerald-600",
    desc: "Toda la documentación laboral, fiscal y de seguridad de su contratista está al día. Cero observaciones. Operación sin restricciones.",
  },
  {
    color: "amarillo" as const,
    label: "Apto Condicionado",
    Icon: CircleAlert,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    accent: "bg-amber-500",
    desc: "Existen observaciones menores (ej.: F.931 pendiente de acuse, póliza ART próxima a vencer). Se otorga un plazo de regularización de 15 días hábiles.",
  },
  {
    color: "rojo" as const,
    label: "Bloqueado",
    Icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-600",
    accent: "bg-red-600",
    desc: "Incumplimientos críticos: aportes impagos, falta de alta ART, convenio AOMA/UOCRA mal aplicado. Se recomienda suspensión preventiva hasta la subsanación completa.",
  },
];

const FAQ = [
  {
    q: "¿Cuáles son los requisitos obligatorios para inscribirse en el RE.PRO.MIN. de San Juan?",
    a: "Para inscribirse en el Registro de Proveedores Mineros (RE.PRO.MIN., Ley 2827-M de San Juan) toda empresa proveedora debe presentar: constancia de inscripción en AFIP y acuse de DDJJ actualizada, libre deuda previsional (F.931 al día), póliza de ART vigente con cobertura específica para actividad minera, nómina de personal con certificación de alta temprana, certificado de aptitud técnica según el rubro de servicio, y comprobante de seguro de responsabilidad civil. Excelsa gestiona la compilación y auditoría de cada uno de estos requisitos para garantizar una presentación sin observaciones.",
  },
  {
    q: "¿Cómo previene el control de contratistas la responsabilidad solidaria laboral?",
    a: "El artículo 30 de la Ley de Contrato de Trabajo (LCT) establece que la empresa principal (mandante) es solidariamente responsable por las obligaciones laborales y de seguridad social de sus contratistas si estos incumplen. En la práctica minera, esto significa que si un subcontratista no deposita aportes sindicales (AOMA/UOCRA), no paga ART o aplica mal el convenio colectivo, los reclamos judiciales o gremiales impactan directamente a la operadora. El control sistemático de contratistas —auditoría mensual de F.931, verificación de altas y bajas en ART, y cruce contra nómina declarada— es la herramienta concreta de Due Diligence que interrumpe la cadena de responsabilidad solidaria.",
  },
  {
    q: "¿Cómo se verifica que un contratista aplica correctamente el convenio AOMA o UOCRA?",
    a: "La verificación involucra tres controles cruzados: (1) se coteja la categoría profesional declarada en los recibos de haberes contra las escalas salariales vigentes del CCT 38/89 (AOMA) o el convenio UOCRA según corresponda; (2) se auditan los ítems específicos del recibo —viáticos por zona desfavorable, adicional por altura, francos compensatorios— para confirmar que se calculan conforme al acuerdo paritario vigente; y (3) se verifica el depósito del aporte sindical y la cuota mutual en las cuentas correctas. Un error frecuente es clasificar trabajadores mineros bajo convenio de construcción o viceversa, lo que genera contingencias gremiales. Excelsa incluye este análisis en su auditoría mensual de contratistas.",
  },
];

// ─── COMPONENTES ────────────────────────────────────────────────────────────

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-excelsa-sand2/70 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-4 py-6 text-left transition-colors hover:text-excelsa-clay"
        aria-expanded={open}
      >
        <span className="flex-1 font-display text-lg font-medium leading-snug text-excelsa-navy sm:text-xl">
          {q}
        </span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={`mt-1 shrink-0 text-excelsa-ink/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[15px] leading-relaxed text-excelsa-ink/70">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DossierModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const res = await fetch(
          'https://hook.us2.make.com/461vlb4gin1w2h0z1m3a1rbmnp66n1a7',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, empresa, cargo }),
          }
        );

        if (!res.ok) throw new Error('Error en el envío');
        setSuccess(true);
      } catch {
        setError('Ocurrió un error al enviar. Intentá nuevamente o escribinos por WhatsApp.');
      } finally {
        setLoading(false);
      }
    },
    [nombre, email, empresa, cargo]
  );

  const resetAndClose = () => {
    setNombre('');
    setEmail('');
    setEmpresa('');
    setCargo('');
    setSuccess(false);
    setError('');
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-excelsa-sand2 bg-white px-5 py-4 text-sm font-medium text-excelsa-ink placeholder:text-excelsa-ink/35 transition-colors focus:border-excelsa-navy focus:outline-none focus:ring-4 focus:ring-excelsa-navy/5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-excelsa-navy/60 backdrop-blur-sm px-4"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[1.75rem] border border-excelsa-sand2/80 bg-excelsa-cream p-8 shadow-2xl sm:p-10"
          >
            <button
              onClick={resetAndClose}
              className="absolute right-5 top-5 rounded-full p-2 text-excelsa-ink/50 transition-colors hover:bg-excelsa-sand/60 hover:text-excelsa-ink"
              aria-label="Cerrar modal"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {!success ? (
              <>
                <div className="mb-7 space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-excelsa-navy text-excelsa-cream">
                    <Download size={22} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-excelsa-navy">
                    Dossier de Compliance Minero
                  </h3>
                  <p className="text-sm leading-relaxed text-excelsa-ink/60">
                    Recibí en tu correo corporativo nuestro documento técnico con la metodología de auditoría de contratistas, requisitos RE.PRO.MIN. y protocolo de mitigación de responsabilidad solidaria.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-excelsa-ink/55">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Martín López"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-excelsa-ink/55">
                      Email corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@empresa.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-excelsa-ink/55">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Nombre de la operadora / contratista"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-excelsa-ink/55">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Ej: Gerente de Legales"
                      className={inputClass}
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-excelsa-navy py-4 text-sm font-bold text-excelsa-cream transition-all hover:bg-excelsa-clay disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Download size={16} aria-hidden="true" />
                    )}
                    {loading ? 'Enviando...' : 'Descargar Dossier'}
                    {!loading && (
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    )}
                  </button>
                  <p className="text-center text-[11px] leading-snug text-excelsa-ink/40">
                    Sus datos son confidenciales y se utilizarán únicamente para el envío del dossier.
                  </p>
                </form>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={32} aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-medium text-excelsa-navy">
                  Dossier enviado
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-excelsa-ink/60">
                  Revisá tu bandeja de entrada. Si no lo encontrás en los próximos minutos, verificá la carpeta de spam o escribinos por WhatsApp.
                </p>
                <button
                  onClick={resetAndClose}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-excelsa-navy px-7 py-3.5 text-sm font-bold text-excelsa-cream transition-all hover:bg-excelsa-clay"
                >
                  Cerrar
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── PÁGINA PRINCIPAL ───────────────────────────────────────────────────────

export default function MineriaPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // Generación automática del JSON-LD para SEO (Rich Snippets) basado en tu array FAQ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-excelsa-cream font-body text-excelsa-ink antialiased">

      {/* Inyección del Script SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <MessageCircle size={20} aria-hidden="true" />
          <span className="hidden md:block">¿Hablamos?</span>
        </Link>
      </motion.div>

      <NavbarPublic />
      <DossierModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ══════════ HERO ══════════ */}
      <section className="texture-grain relative overflow-hidden bg-excelsa-cream pb-20 pt-32 lg:pb-28 lg:pt-44">
        <ContourBg tone="cream" />
        {/* halo cálido */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-excelsa-claysoft/40 blur-[130px]" />
        {/* halo navy secundario */}
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-excelsa-navy/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-4xl text-center">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full border border-excelsa-navy/15 bg-white/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-navy"
            >
              <HardHat size={13} className="text-excelsa-clay" aria-hidden="true" />
              Compliance Minero · San Juan
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-7 font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.02em] text-excelsa-navy sm:text-5xl lg:text-[4.2rem]"
            >
              Blindamos su operación minera contra la{' '}
              <span className="italic text-excelsa-clay brush-underline">
                responsabilidad solidaria
              </span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-excelsa-ink/70"
            >
              Auditoría documental de contratistas para operadoras Tier&nbsp;1 y adecuación
              Ley&nbsp;2827-M / RE.PRO.MIN. para proveedores locales. Control mensual integral
              en San Juan, con metodología propia y respaldo legal.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setModalOpen(true)}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-excelsa-navy px-8 py-4 text-sm font-bold text-excelsa-cream shadow-xl shadow-excelsa-navy/20 transition-all hover:bg-excelsa-clay"
              >
                <Download size={16} aria-hidden="true" />
                Descargar Dossier de Compliance
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </button>
              <Link
                href={WHATSAPP_MINERIA_PYME}
                target="_blank"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-excelsa-navy/20 px-8 py-4 text-sm font-bold text-excelsa-navy transition-all hover:border-excelsa-navy/50 hover:bg-white/50"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Soy proveedor, necesito RE.PRO.MIN.
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                { Icon: ShieldCheck, label: "Due Diligence Laboral" },
                { Icon: Scale, label: "Art. 30 LCT" },
                { Icon: FileCheck, label: "Ley 2827-M" },
                { Icon: Factory, label: "RE.PRO.MIN." },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-excelsa-ink/50">
                  <Icon size={15} className="text-excelsa-clay" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ BIFURCACIÓN DE USUARIO ══════════ */}
      <section className="relative bg-excelsa-sand/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="mb-14 max-w-2xl"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Soluciones por perfil
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              ¿Operadora Tier&nbsp;1 o proveedor local? Tenemos la solución precisa.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Tarjeta A — Operadoras Tier 1 */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-excelsa-sand2/80 bg-white p-9 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-excelsa-navy/8 lg:p-10"
            >
              {/* Acento superior */}
              <div className="absolute left-0 top-0 h-1.5 w-full bg-excelsa-navy" />

              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-excelsa-navy text-excelsa-cream transition-colors group-hover:bg-excelsa-clay">
                  <Building2 size={24} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-ink/40">Para Operadoras</span>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-excelsa-navy">
                    Auditoría Externa de Contratistas
                  </h3>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-excelsa-ink/70">
                Su cadena de subcontratación es su mayor exposición legal. Un solo F.931 sin depositar,
                un convenio AOMA/UOCRA mal liquidado, o una ART vencida activan la responsabilidad solidaria
                del Art.&nbsp;30 LCT y pueden paralizar la operación ante un conflicto sindical.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-excelsa-sand2/70 pt-6">
                {[
                  "Auditoría mensual de F.931, ART y aportes sindicales",
                  "Verificación de convenios AOMA / UOCRA por categoría",
                  "Tablero de semáforo con estado de cada contratista",
                  "Informe ejecutivo de riesgo para Directorio",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-excelsa-ink/75">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-excelsa-navy" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <button
                  onClick={() => setModalOpen(true)}
                  className="group/btn flex w-full items-center justify-center gap-2.5 rounded-xl bg-excelsa-navy py-4 text-sm font-bold text-excelsa-cream transition-all hover:bg-excelsa-clay"
                >
                  <Download size={16} aria-hidden="true" />
                  Descargar Dossier de Compliance
                  <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                </button>
                <p className="mt-3 text-center text-[11px] text-excelsa-ink/40">
                  Documento técnico reservado para decisores. Sin compromiso.
                </p>
              </div>
            </motion.div>

            {/* Tarjeta B — PYMES Proveedoras */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-excelsa-sand2/80 bg-white p-9 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-excelsa-navy/8 lg:p-10"
            >
              {/* Acento superior */}
              <div className="absolute left-0 top-0 h-1.5 w-full bg-excelsa-clay" />

              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-excelsa-clay text-white transition-colors group-hover:bg-excelsa-navy">
                  <HardHat size={24} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-excelsa-ink/40">Para Proveedores</span>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-excelsa-navy">
                    Adecuación Ley 2827-M y RE.PRO.MIN.
                  </h3>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-excelsa-ink/70">
                Si no estás inscripto y homologado en el RE.PRO.MIN., no podés licitar ni ser adjudicado
                por operadoras mineras en San Juan. Cada día sin la Aptitud Minera es una licitación
                que perdés y un competidor que te pasa por encima.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-excelsa-sand2/70 pt-6">
                {[
                  "Diagnóstico de brechas vs. requisitos RE.PRO.MIN.",
                  "Armado completo del legajo documental",
                  "Adecuación laboral, fiscal y de seguridad e higiene",
                  "Acompañamiento hasta la homologación final",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-excelsa-ink/75">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-excelsa-clay" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href={WHATSAPP_MINERIA_PYME}
                  target="_blank"
                  className="group/btn flex w-full items-center justify-center gap-2.5 rounded-xl bg-excelsa-clay py-4 text-sm font-bold text-white transition-all hover:bg-excelsa-navy"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Necesito mi Aptitud Minera ya
                  <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                </Link>
                <p className="mt-3 text-center text-[11px] text-excelsa-ink/40">
                  Respuesta en menos de 24 hs. Coordine una reunión urgente.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ SEMÁFORO DE GESTIÓN ══════════ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="mb-14 max-w-2xl"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Metodología propia
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Semáforo de Gestión: control documental mensual.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-lg leading-relaxed text-excelsa-ink/70">
              Cada mes auditamos la totalidad de la documentación laboral, fiscal y de seguridad
              de sus contratistas y asignamos un estado de semáforo. El resultado se presenta en un
              tablero ejecutivo que permite tomar decisiones en minutos, no en semanas.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerFast}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {SEMAFORO.map(({ label, Icon, bg, border, iconColor, accent, desc }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border ${border} ${bg} p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                {/* Barra de color */}
                <div className={`absolute left-0 top-0 h-1.5 w-full ${accent}`} />

                <div className="mb-5 flex items-center gap-3">
                  <Icon size={28} className={iconColor} aria-hidden="true" />
                  <h3 className="font-display text-xl font-semibold text-excelsa-navy">
                    {label}
                  </h3>
                </div>
                <p className="text-[15px] leading-relaxed text-excelsa-ink/70">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA banda inline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 flex flex-col items-start gap-5 rounded-2xl bg-excelsa-navy px-8 py-7 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <ClipboardCheck size={24} className="shrink-0 text-excelsa-clay" aria-hidden="true" />
              <p className="font-display text-xl text-excelsa-cream sm:text-2xl">
                Solicite una demostración del tablero de semáforo para su operación.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-excelsa-clay px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-excelsa-navy"
            >
              Descargar Dossier
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════ POR QUÉ EXCELSA (Confianza) ══════════ */}
      <section className="relative overflow-hidden bg-excelsa-navy py-24 lg:py-32">
        <ContourBg tone="navy" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-excelsa-clay/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-14 max-w-2xl space-y-4"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Por qué Excelsa
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-cream lg:text-5xl">
              No somos un estudio contable más. Somos especialistas en riesgo minero.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                t: "Base San Juan",
                d: "Presencia local con conocimiento directo de la operación minera sanjuanina y sus actores gremiales.",
              },
              {
                num: "02",
                t: "Equipo multidisciplinario",
                d: "Contadores, abogados laboralistas y especialistas en higiene y seguridad bajo un mismo techo.",
              },
              {
                num: "03",
                t: "Metodología probada",
                d: "Semáforo de Gestión con más de 200 empresas auditadas. Procesos estandarizados, no artesanales.",
              },
              {
                num: "04",
                t: "Soporte continuo",
                d: "No entregamos un informe y desaparecemos. Acompañamiento mensual con canal directo al equipo.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
              >
                <span className="font-display text-3xl font-semibold text-excelsa-cream/20">{item.num}</span>
                <h4 className="mt-3 font-display text-lg font-medium text-excelsa-cream">{item.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-excelsa-cream/55">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ SEO ══════════ */}
      <section className="bg-excelsa-sand/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-14 max-w-2xl space-y-4"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
              Preguntas frecuentes
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy lg:text-5xl">
              Lo que necesita saber sobre compliance minero en San Juan.
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl rounded-[1.75rem] border border-excelsa-sand2/80 bg-white px-8 py-2 shadow-lg shadow-excelsa-navy/5 lg:px-10"
          >
            {FAQ.map((item, i) => (
              <AccordionItem key={i} q={item.q} a={item.a} />
            ))}
          </motion.div>
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
            <img src="/logoblanco.png" alt="Logo de Excelsa en blanco" className="h-12 w-auto opacity-90" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-cream lg:text-6xl">
            Cada día sin control es un día de riesgo abierto.
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-excelsa-cream/65">
            Ya sea que necesite auditar a sus contratistas o lograr la Aptitud Minera
            para su PYME, el primer paso es una conversación técnica. Sin compromiso.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setModalOpen(true)}
              className="group inline-flex items-center gap-2.5 rounded-full bg-excelsa-clay px-9 py-4 text-sm font-bold text-white shadow-2xl shadow-excelsa-clay/25 transition-all hover:bg-white hover:text-excelsa-navy"
            >
              <Download size={16} aria-hidden="true" />
              Dossier para Operadoras
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
            <Link
              href={WHATSAPP_MINERIA_PYME}
              target="_blank"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-excelsa-cream transition-all hover:border-white/50 hover:bg-white/5"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Soy proveedor, escribir ahora
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <FooterPublic />
    </div>
  );
}