"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Wallet, Calendar, CreditCard, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ModalPago({ factura, onSuccess, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const [monto, setMonto] = useState(factura.total);
  const [metodo, setMetodo] = useState('Transferencia');

  const registrarPago = async () => {
    setLoading(true);
    try {
      // 1. Insertar el pago
      const { error: errorPago } = await supabase.from('pagos').insert([{
        factura_id: factura.id,
        cliente_id: factura.cliente_id,
        monto: parseFloat(monto),
        metodo_pago: metodo,
        fecha_pago: new Date().toISOString().split('T')[0]
      }]);

      if (errorPago) throw errorPago;

      // 2. Actualizar el estado de la factura si el pago es total
      // Por ahora algo simple: si el monto es igual al total, marcar como pagada
      if (parseFloat(monto) >= factura.total) {
        await supabase
          .from('facturas')
          .update({ estado: 'Pagada' })
          .eq('id', factura.id);
      }

      toast.success("Pago registrado correctamente");
      onSuccess();
    } catch (e) {
      toast.error("Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Registrar Cobro</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-center">Monto Recibido</label>
            <div className="relative">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary">$</span>
               <input 
                 type="number" 
                 value={monto} 
                 onChange={(e) => setMonto(e.target.value)}
                 className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-6 pl-12 pr-6 text-3xl font-black text-slate-900 dark:text-white text-center outline-none focus:ring-4 focus:ring-primary/10 transition-all"
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={() => setMetodo('Transferencia')}
               className={`p-4 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-2 transition-all ${metodo === 'Transferencia' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
             >
               <CreditCard size={20} /> Transferencia
             </button>
             <button 
               onClick={() => setMetodo('Efectivo')}
               className={`p-4 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-2 transition-all ${metodo === 'Efectivo' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
             >
               <Wallet size={20} /> Efectivo
             </button>
          </div>

          <button 
            onClick={registrarPago}
            disabled={loading}
            className="w-full py-4 bg-primary hover:brightness-110 text-white rounded-2xl font-black shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            CONFIRMAR COBRO
          </button>
        </div>
      </div>
    </div>
  );
}