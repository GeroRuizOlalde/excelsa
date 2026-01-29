"use client";

import { Trophy, Users } from 'lucide-react';

export function RankingClientes({ clientes }: { clientes: any[] }) {
  const maxTotal = clientes.length > 0 ? clientes[0].total : 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8 text-xl tracking-tight">
        <Trophy size={22} className="text-yellow-500" /> 
        Top 5 Clientes (Volumen)
      </h3>
      
      <div className="space-y-6">
        {clientes.map((c, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{i + 1}</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px] md:max-w-[200px]">
                  {c.nombre}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 dark:text-white">$ {c.total.toLocaleString('es-AR')}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{c.facturas} comprobantes</p>
              </div>
            </div>
            {/* Barra de progreso visual */}
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out" 
                style={{ width: `${(c.total / maxTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}