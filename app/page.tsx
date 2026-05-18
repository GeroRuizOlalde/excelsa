"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Building2, Users, FileText, Settings, 
  Zap, TrendingUp, Briefcase, Globe, LocateFixed,
  Menu, X, ShieldCheck, BarChart4, MessageCircle,
  Plus, Minus, Check, ArrowUpRight, LogIn
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const WHATSAPP_LINK = "https://wa.me/5492646721545?text=Hola%20Excelsa%2C%20quiero%20coordinar%20un%20diagn%C3%B3stico%20para%20mi%20empresa.%20";

const SERVICIOS_CATEGORIZADOS = [
  {
    categoria: "Soluciones Empresariales",
    desc: "La base operativa y legal de su estructura.",
    icon: <Building2 className="w-8 h-8" />,
    items: [
      { t: "Contabilidad e Impuestos", d: "Liquidaciones proactivas y balances auditados." },
      { t: "Asesoría Legal", d: "Blindaje societario, contratos y cumplimiento normativo." },
      { t: "Administración y Finanzas", d: "Gestión de tesorería y control estricto de costos." }
    ],
    entregables: ["Reporte de rentabilidad real", "Planificación fiscal anual"]
  },
  {
    categoria: "Gestión y Estrategia",
    desc: "Eficiencia para la toma de decisiones.",
    icon: <Settings className="w-8 h-8" />,
    items: [
      { t: "Planificación Estratégica", d: "Definición de objetivos OKR y tableros KPI." },
      { t: "Logística y Operaciones", d: "Optimización de suministros y reducción de mermas." },
      { t: "Gestión de Procesos", d: "Estandarización y manuales de funciones operativos." }
    ],
    entregables: ["Dashboard de KPIs", "Manual de procedimientos"]
  },
  {
    categoria: "Crecimiento y Sostenibilidad",
    desc: "Visión de futuro y marca con propósito.",
    icon: <TrendingUp className="w-8 h-8" />,
    items: [
      { t: "Comercialización y Marca", d: "Estrategia de posicionamiento y gestión comercial." },
      { t: "Desarrollo de Producto", d: "Análisis de viabilidad y lanzamiento de unidades." },
      { t: "Sostenibilidad (ODS)", d: "Modelos de negocio responsables y competitivos." }
    ],
    entregables: ["Plan de ventas trimestral", "Hoja de ruta sostenible"]
  }
];

// --- COMPONENTES ---

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex justify-between items-center text-left hover:text-blue-600 transition-colors">
        <span className="font-bold text-slate-800 text-sm md:text-base">{q}</span>
        {isOpen ? <Minus size={18} className="text-blue-600"/> : <Plus size={18} className="text-slate-300"/>}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-slate-500 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function LandingExcelsa() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600/10 selection:text-blue-700">
      
      {/* BOTÓN WHATSAPP MOBILE-OPTIMIZED */}
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        className="fixed bottom-6 right-6 z-[60] md:bottom-8 md:right-8"
      >
        <Link href={WHATSAPP_LINK} target="_blank" className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group hover:scale-110 transition-transform">
          <MessageCircle size={28} />
          <span className="hidden md:inline font-bold text-sm">¿Hablamos?</span>
        </Link>
      </motion.div>

      {/* NAVBAR */}
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled || menuOpen ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Lado Izquierdo: Logo */}
          <div className="flex items-center gap-3 relative z-50">
            <img src="/logoblanco.png" alt="Icono Excelsa" className="h-9 w-9 object-contain" />
            <span className={`text-xl font-bold tracking-tighter transition-colors ${scrolled || menuOpen ? 'text-slate-900' : 'text-white'}`}> EXCELSA</span>
          </div>
          
          {/* Lado Derecho: Desktop */}
          <div className={`hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] ${scrolled ? 'text-slate-500' : 'text-white/70'}`}>
            <Link href="#servicios" className="hover:text-blue-600 transition-colors">Servicios</Link>
            <Link href="#metodo" className="hover:text-blue-600 transition-colors">Metodología</Link>
            <Link href="/login" className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all ${scrolled ? 'border-slate-200 text-slate-900 hover:bg-slate-50' : 'border-white/20 text-white hover:bg-white/10'}`}>
              <LogIn size={14} /> Ingreso
            </Link>
            <Link href={WHATSAPP_LINK} target="_blank" className="bg-blue-600 text-white px-7 py-2.5 rounded-full hover:bg-slate-900 transition-all shadow-lg shadow-blue-600/20">WhatsApp</Link>
          </div>

          {/* Lado Derecho: Mobile Toggles */}
          <div className="flex items-center gap-4 lg:hidden relative z-50">
            {/* Ícono Login Mobile (Siempre visible) */}
            <Link href="/login" className={`p-2 rounded-lg transition-colors ${scrolled || menuOpen ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'}`}>
              <LogIn size={20} />
            </Link>
            {/* Botón Hamburguesa */}
            <button className={`${scrolled || menuOpen ? 'text-slate-900' : 'text-white'} transition-colors`} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28}/> : <Menu size={28}/>}
            </button>
          </div>
        </div>

        {/* MENÚ DESPLEGABLE MOBILE */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl flex flex-col p-6 gap-6 lg:hidden"
            >
              <Link href="#servicios" onClick={() => setMenuOpen(false)} className="text-sm font-bold text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">
                Servicios
              </Link>
              <Link href="#metodo" onClick={() => setMenuOpen(false)} className="text-sm font-bold text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">
                Metodología
              </Link>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atención al cliente</p>
                <Link href={WHATSAPP_LINK} onClick={() => setMenuOpen(false)} target="_blank" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20">
                  Contactar por WhatsApp <MessageCircle size={18} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION - TEXT LEFT, IMAGE RIGHT, COLOR BG */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Consultoría B2B Elite
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tighter">
              Profesionalice su <br />
              <span className="text-blue-500 italic">gestión estratégica</span> <br />
              de principio a fin.
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Unificamos la dirección comercial, financiera y legal de su empresa. Acompañamos a dueños a optimizar procesos para un crecimiento sin techo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link href={WHATSAPP_LINK} target="_blank" className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 uppercase text-xs tracking-widest">
                Hablar por WhatsApp <MessageCircle size={20}/>
              </Link>
              <Link href="#servicios" className="px-10 py-5 bg-white/5 backdrop-blur-md text-white border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                Servicios <ArrowUpRight size={18}/>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="relative hidden lg:block"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative z-10">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Consultoría Excelsa" />
            </div>
            <div className="absolute inset-0 translate-x-8 translate-y-8 rounded-[3rem] border-2 border-blue-500/30 -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* SERVICIOS - STAGGER ANIMATION */}
      <section id="servicios" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16 md:mb-24 space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter italic underline decoration-blue-600 decoration-4 underline-offset-8 inline-block text-slate-900">Soluciones integrales.</h2>
            <p className="text-base md:text-lg text-slate-500 font-medium italic">El equipo externo que integra cada pieza de su maquinaria empresarial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SERVICIOS_CATEGORIZADOS.map((cat, i) => (
              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {cat.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{cat.categoria}</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-8">{cat.desc}</p>
                <div className="space-y-6 mb-10">
                  {cat.items.map((s, idx) => (
                    <div key={idx}>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{s.t}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{s.d}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-slate-50 space-y-2">
                  {cat.entregables.map((e, idx) => <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-400"><Check size={14} className="text-blue-600" /> {e}</div>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGÍA - STEPPER ANIMADO */}
      <section id="metodo" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter italic mb-8 text-slate-900">Un método de <br /> ejecución real.</h2>
            <p className="text-lg text-slate-500 font-medium mb-12 italic">Sin carpetas teóricas. Procesos funcionando y rentabilidad auditada.</p>
            <Link href={WHATSAPP_LINK} target="_blank" className="inline-flex items-center gap-3 text-blue-600 font-black uppercase text-xs tracking-[0.2em] hover:translate-x-2 transition-transform">
              Diagnóstico inicial sin cargo <ArrowRight size={18} />
            </Link>
          </div>
          <div className="space-y-10 relative">
            {[
              { t: "Diagnóstico", d: "Analizamos cuellos de botella impositivos, operativos y comerciales." },
              { t: "Plan Estratégico", d: "Hoja de ruta con entregables, plazos y responsables definidos." },
              { t: "Implementación", d: "Acompañamos a su equipo en la trinchera para poner en marcha los procesos." },
              { t: "Medición", d: "Auditamos los resultados con KPI reales para garantizar la rentabilidad." }
            ].map((step, i) => (
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                viewport={{ once: true }}
                key={i} 
                className="flex gap-6 relative"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">0{i+1}</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg md:text-xl mb-1">{step.t}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRUEBA SOCIAL & FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter italic mb-8 text-slate-900">Despeje sus dudas.</h2>
              <div className="space-y-1">
                <FAQItem q="¿Cómo se define el costo?" a="Trabajamos con abonos mensuales tras un diagnóstico gratuito, asegurando que el ahorro generado cubra la inversión." />
                <FAQItem q="¿Es presencial o remoto?" a="Híbrido. Base en San Juan para visitas técnicas y gestión digital para el seguimiento diario." />
                <FAQItem q="¿Debo cambiar a mi contador?" a="No. Trabajamos en conjunto con su equipo actual para potenciar la estrategia fiscal." />
                <FAQItem q="¿Qué entregan concretamente?" a="Tableros digitales, manuales de procesos y liquidaciones listas para pagar." />
              </div>
           </div>
           <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter italic text-slate-900 text-center md:text-left">Lo que dicen los dueños.</h2>
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm italic text-slate-600 text-sm relative">
                 <span className="absolute -top-4 left-8 text-6xl text-blue-100 leading-none italic font-serif">"</span>
                 "Lograron lo que otras consultoras no pudieron: que mi equipo adopte los procesos. La visión integrada es su gran valor."
                 <p className="mt-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">— Directora Industrial</p>
              </div>
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm italic text-slate-600 text-sm relative">
                 <span className="absolute -top-4 left-8 text-6xl text-blue-100 leading-none italic font-serif">"</span>
                 "Profesionalismo y cercanía. Excelsa nos dio el orden administrativo que necesitábamos para poder exportar."
                 <p className="mt-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">— Socio Gerente Constructora</p>
              </div>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs italic">E</div>
            <span className="font-bold text-sm tracking-tighter uppercase text-slate-900">EXCELSA</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href={WHATSAPP_LINK} className="hover:text-blue-600 transition-colors">WhatsApp</Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">Acceso Clientes</Link>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            © 2026 Excelsa • Powered by <span className="text-blue-600 font-black">Riva Estudio</span>
          </p>
        </div>
      </footer>
    </div>
  );
}