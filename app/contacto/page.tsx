"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, MapPin, Clock, ArrowRight } from 'lucide-react';
import NavbarPublic from '@/components/NavbarPublic';
import FooterPublic from '@/components/FooterPublic';
import { WHATSAPP_LINK } from '@/lib/constants';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function ContactoPage() {
  const [nombre,  setNombre]  = useState('');
  const [empresa, setEmpresa] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = `Hola Excelsa, soy ${nombre}${empresa ? ` de ${empresa}` : ''}. ${mensaje}`;
    window.open(`https://wa.me/5492646721545?text=${encodeURIComponent(texto)}`, '_blank');
  };

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
              Contacto
            </motion.span>
            <motion.h1 variants={fadeUp}
              className="text-5xl lg:text-7xl font-black text-white tracking-[-0.03em] leading-[0.9]">
              Hablemos.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-lg leading-relaxed">
              El primer paso es una conversación. Sin compromiso, sin costo.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section className="py-32 lg:py-44 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">

          {/* Info lateral */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-700">
                Atención directa
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-[-0.025em]">
                Preferimos una conversación real.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Somos una consultora de cercanía. Respondemos personalmente y sin demoras.
                El canal más rápido es WhatsApp.
              </p>
            </motion.div>

            {/* WhatsApp card */}
            <motion.div variants={fadeUp}>
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                className="group flex items-center gap-5 p-7 rounded-2xl bg-[#25D366]/8
                           border border-[#25D366]/20 hover:border-[#25D366]/50 hover:shadow-lg
                           transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#25D366] flex items-center justify-center text-white flex-shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900">WhatsApp Directo</p>
                  <p className="text-sm text-slate-500 mt-0.5">+54 9 264 672-1545</p>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Info adicional */}
            <motion.div variants={fadeUp} className="space-y-5 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">Ubicación</p>
                  <p className="text-sm text-slate-500 mt-0.5">San Juan, Argentina · Atención regional y remota</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">Horario de atención</p>
                  <p className="text-sm text-slate-500 mt-0.5">Lunes a viernes · 9:00 – 18:00 hs</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50
                             text-slate-900 placeholder:text-slate-400 text-sm font-medium
                             focus:outline-none focus:border-blue-700 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Empresa
                </label>
                <input
                  type="text"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  placeholder="Nombre de tu empresa (opcional)"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50
                             text-slate-900 placeholder:text-slate-400 text-sm font-medium
                             focus:outline-none focus:border-blue-700 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  ¿En qué podemos ayudarte? *
                </label>
                <textarea
                  required
                  rows={5}
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                  placeholder="Contanos brevemente sobre tu empresa y qué necesitás..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50
                             text-slate-900 placeholder:text-slate-400 text-sm font-medium
                             focus:outline-none focus:border-blue-700 focus:bg-white transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-3 py-4.5 bg-blue-700 text-white
                           font-black rounded-xl hover:bg-[#0c1a3e] transition-all text-sm tracking-wide"
              >
                <MessageCircle size={16} />
                Enviar por WhatsApp
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-slate-400 text-center leading-snug">
                Al enviar, se abrirá WhatsApp con tu mensaje pre-completado.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section className="py-24 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", t: "Diagnóstico sin cargo",     d: "La primera conversación es gratuita. Sin compromisos, sin presión." },
              { n: "02", t: "Respuesta en 24 horas",     d: "Todas las consultas son respondidas personalmente en menos de un día hábil." },
              { n: "03", t: "Sin letra chica",            d: "Honorarios claros desde el primer momento. Sin sorpresas ni costos ocultos." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-5 p-7 rounded-2xl bg-white border border-slate-100"
              >
                <span className="text-3xl font-black text-slate-200 flex-shrink-0">{item.n}</span>
                <div>
                  <h4 className="font-black text-slate-900 mb-1.5">{item.t}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
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
