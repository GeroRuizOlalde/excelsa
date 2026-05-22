"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, MapPin, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import PageHero from '@/components/PageHero';
import { WHATSAPP_LINK } from '@/lib/constants';
import { fadeUp, stagger } from '@/lib/motion';

export default function ContactoPage() {
  const [nombre,  setNombre]  = useState('');
  const [empresa, setEmpresa] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = `Hola Excelsa, soy ${nombre}${empresa ? ` de ${empresa}` : ''}. ${mensaje}`;
    window.open(`https://wa.me/5492646721545?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const inputClass =
    "w-full rounded-xl border border-excelsa-sand2 bg-white px-5 py-4 text-sm font-medium text-excelsa-ink placeholder:text-excelsa-ink/35 transition-colors focus:border-excelsa-navy focus:outline-none focus:ring-4 focus:ring-excelsa-navy/5";

  return (
    <div className="min-h-screen bg-excelsa-cream font-body text-excelsa-ink antialiased">
      <NavbarPublic />

      <PageHero
        eyebrow="Contacto"
        title="Hablemos."
        subtitle="El primer paso es una conversación. Sin compromiso, sin costo."
      />

      {/* ── CONTACTO ── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">

          {/* Info lateral */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-10">
            <motion.div variants={fadeUp} className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">Atención directa</span>
              <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-excelsa-navy">
                Preferimos una conversación real.
              </h2>
              <p className="text-lg leading-relaxed text-excelsa-ink/70">
                Somos una consultora de cercanía. Respondemos personalmente y sin demoras.
                El canal más rápido es WhatsApp.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link
                href={WHATSAPP_LINK} target="_blank"
                className="group flex items-center gap-5 rounded-2xl border border-[#25D366]/25 bg-[#25D366]/8 p-7 transition-all duration-300 hover:border-[#25D366]/55 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
                  <MessageCircle size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-excelsa-navy">WhatsApp Directo</p>
                  <p className="mt-0.5 text-sm text-excelsa-ink/60">+54 9 264 672-1545</p>
                </div>
                <ArrowUpRight size={16} className="text-excelsa-ink/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-5 border-t border-excelsa-sand2 pt-7">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-excelsa-claysoft/40 text-excelsa-clay">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-excelsa-navy">Ubicación</p>
                  <p className="mt-0.5 text-sm text-excelsa-ink/60">San Juan, Argentina · Atención regional y remota</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-excelsa-claysoft/40 text-excelsa-clay">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-excelsa-navy">Horario de atención</p>
                  <p className="mt-0.5 text-sm text-excelsa-ink/60">Lunes a viernes · 9:00 – 18:00 hs</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-[1.75rem] border border-excelsa-sand2/80 bg-white p-8 shadow-xl shadow-excelsa-navy/5 lg:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-excelsa-ink/55">Nombre *</label>
                <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo" className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-excelsa-ink/55">Empresa</label>
                <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Nombre de tu empresa (opcional)" className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-excelsa-ink/55">¿En qué podemos ayudarte? *</label>
                <textarea required rows={5} value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Contanos brevemente sobre tu empresa y qué necesitás..." className={`${inputClass} resize-none`} />
              </div>
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-excelsa-navy py-4 text-sm font-bold text-excelsa-cream transition-all hover:bg-excelsa-clay"
              >
                <MessageCircle size={16} />
                Enviar por WhatsApp
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-center text-[11px] leading-snug text-excelsa-ink/45">
                Al enviar, se abrirá WhatsApp con tu mensaje pre-completado.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section className="bg-excelsa-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Diagnóstico sin cargo", d: "La primera conversación es gratuita. Sin compromisos, sin presión." },
              { n: "02", t: "Respuesta en 24 horas", d: "Todas las consultas se responden personalmente en menos de un día hábil." },
              { n: "03", t: "Sin letra chica",       d: "Honorarios claros desde el primer momento. Sin sorpresas ni costos ocultos." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-5 rounded-2xl border border-excelsa-sand2/80 bg-white p-7"
              >
                <span className="font-display text-3xl font-semibold text-excelsa-sand2">{item.n}</span>
                <div>
                  <h4 className="font-display text-lg font-medium text-excelsa-navy">{item.t}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-excelsa-ink/65">{item.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
}
