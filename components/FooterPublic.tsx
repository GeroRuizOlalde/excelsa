import Link from 'next/link';
import { MessageCircle, ArrowUpRight, MapPin } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';
import ContourBg from './ContourBg';

export default function FooterPublic() {
  return (
    <footer className="relative overflow-hidden bg-excelsa-navy font-body text-excelsa-cream">
      <ContourBg tone="navy" className="opacity-70" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">

        {/* Llamado final */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logoblanco.png" alt="Excelsa" className="h-10 w-auto" />
              <span className="font-display text-2xl font-medium">Excelsa</span>
            </div>
            <p className="font-display text-2xl leading-snug text-excelsa-cream/90 sm:text-3xl">
              ¿Empezamos a subir la próxima cima de tu empresa?
            </p>
          </div>
          <Link
            href={WHATSAPP_LINK}
            target="_blank"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-excelsa-clay px-7 py-4 font-bold text-excelsa-cream transition-all hover:bg-white hover:text-excelsa-navy"
          >
            <MessageCircle size={18} /> Hablemos por WhatsApp
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Columnas */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div className="col-span-2 space-y-4 md:col-span-1">
            <p className="max-w-[240px] text-sm leading-relaxed text-excelsa-cream/55">
              Consultoría empresarial integral en San Juan. Estructura, visión y ejecución
              para organizaciones que quieren crecer en serio.
            </p>
            <p className="flex items-center gap-2 text-sm text-excelsa-cream/55">
              <MapPin size={14} className="text-excelsa-clay" /> San Juan, Argentina
            </p>
          </div>

          <FooterCol
            title="Empresa"
            links={[
              { href: '/nosotros',  label: 'Nosotros' },
              { href: '/servicios', label: 'Servicios' },
              { href: '/casos',     label: 'Casos' },
              { href: '/contacto',  label: 'Contacto' },
            ]}
          />
          <FooterCol
            title="Servicios"
            links={[
              { href: '/servicios', label: 'Soluciones Empresariales' },
              { href: '/servicios', label: 'Gestión y Estrategia' },
              { href: '/servicios', label: 'Crecimiento Sostenible' },
            ]}
          />

          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-excelsa-cream/40">Acceso</p>
            <nav className="flex flex-col gap-3">
              <Link href="/login" className="text-sm text-excelsa-cream/65 transition-colors hover:text-white">
                Portal de clientes
              </Link>
              <Link href={WHATSAPP_LINK} target="_blank" className="text-sm font-semibold text-excelsa-clay transition-colors hover:text-white">
                WhatsApp directo
              </Link>
            </nav>
          </div>
        </div>

        {/* Base */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 md:flex-row">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-excelsa-cream/40">
            © {new Date().getFullYear()} Excelsa · Todos los derechos reservados
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-excelsa-cream/40">
            Desarrollado por <a href="https://rivaestudio.com.ar" target="_blank" rel="noopener noreferrer" className="text-excelsa-clay transition-colors hover:text-white">Riva Estudio</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-excelsa-cream/40">{title}</p>
      <nav className="flex flex-col gap-3">
        {links.map(({ href, label }) => (
          <Link key={label} href={href} className="text-sm text-excelsa-cream/65 transition-colors hover:text-white">
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
