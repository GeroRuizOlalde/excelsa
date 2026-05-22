import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

export default function FooterPublic() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0c1a3e] rounded-lg flex items-center justify-center font-black text-white text-sm italic">E</div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">Excelsa</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">
              Consultoría empresarial integral para organizaciones que buscan crecer con estructura y visión.
            </p>
          </div>

          {/* Empresa */}
          <div className="space-y-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Empresa</span>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/nosotros',  label: 'Nosotros' },
                { href: '/servicios', label: 'Servicios' },
                { href: '/casos',     label: 'Casos' },
                { href: '/contacto',  label: 'Contacto' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-sm text-slate-500 hover:text-blue-700 transition-colors font-medium">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Servicios */}
          <div className="space-y-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Servicios</span>
            <nav className="flex flex-col gap-3">
              {[
                'Soluciones Empresariales',
                'Gestión y Estrategia',
                'Crecimiento Sostenible',
              ].map((s) => (
                <Link key={s} href="/servicios"
                  className="text-sm text-slate-500 hover:text-blue-700 transition-colors font-medium">
                  {s}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contacto</span>
            <div className="space-y-3">
              <p className="text-sm text-slate-500">San Juan, Argentina</p>
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#25D366] hover:opacity-75 transition-opacity"
              >
                <MessageCircle size={14} /> WhatsApp Directo
              </Link>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Excelsa · Todos los derechos reservados.
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Desarrollado por <span className="text-blue-700">Riva Estudio</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
