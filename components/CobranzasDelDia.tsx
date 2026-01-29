"use client";

import { MessageCircle, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface CobranzasProps {
  facturas: any[];
  config: any;
}

export function CobranzasDelDia({ facturas, config }: CobranzasProps) {
  // Filtramos: Facturas que no estén pagadas ni anuladas
  const criticas = facturas.filter(f => f.estado === 'Pendiente' || f.estado === 'Vencida').slice(0, 5);

  const enviarWhatsApp = (f: any) => {
    const telefono = f.clientes?.telefono;
    if (!telefono) return toast.error("El cliente no tiene un teléfono registrado");

    const mensaje = `Hola *${f.clientes.razon_social}*! 👋\n\nTe envío un recordatorio de la factura *#${f.numero_comprobante}* que se encuentra pendiente de pago por un total de *${f.total.toLocaleString('es-AR', {style: 'currency', currency: 'ARS'})}*.\n\n📎 *¿Podrías enviarnos el comprobante si ya lo abonaste?*\n\nSaludos de parte de *${config?.nombre_empresa || 'Riva Estudio'}*.`;

    const url = `https://api.whatsapp.com/send?phone=${telefono.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(mensaje)}`;
    
    toast.info("Abriendo chat de WhatsApp...");
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" /> 
            Cobranzas Pendientes
          </h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Acción rápida por WhatsApp</p>
        </div>
      </div>

      <div className="space-y-3">
        {criticas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
            <p className="text-xs font-medium text-slate-500">Sin deudas pendientes</p>
          </div>
        ) : (
          criticas.map(f => (
            <div key={f.id} className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                  {f.clientes?.razon_social}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${f.estado === 'Vencida' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {f.estado}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    $ {f.total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => enviarWhatsApp(f)}
                className="shrink-0 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                title="Enviar recordatorio"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {criticas.length > 0 && (
        <p className="text-[9px] text-center text-slate-400 mt-6 italic">
          Mostrando las primeras {criticas.length} facturas críticas.
        </p>
      )}
    </div>
  );
}