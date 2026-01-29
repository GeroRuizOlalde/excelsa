"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Tag, AlignLeft, DollarSign, Loader2, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner'; // Usamos Sonner para consistencia

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // RGB por defecto

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    iva: '21'
  });

  // --- HELPER COLOR ---
  const hexToRgb = (hex: string) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255].join(', ');
    }
    return '208, 255, 0';
  }

  // 1. CARGAR IDENTIDAD DE MARCA DINÁMICA
  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('configuracion').select('color_primario').single(); // Traemos cualquiera disponible
      if (data?.color_primario) {
        setAccentColor(hexToRgb(data.color_primario));
      }
    };
    fetchConfig();
  }, []);

  // 2. LÓGICA DE GUARDADO
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validación simple
    if(!form.nombre || !form.precio) {
        toast.warning("El nombre y el precio son obligatorios.");
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase.from('productos').insert([{
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio) || 0,
        iva: parseFloat(form.iva)
      }]);
      
      if (error) throw error;
      
      toast.success("Servicio guardado correctamente");
      router.push('/productos');
      router.refresh();
    } catch (error: any) {
      toast.error('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // INYECCIÓN DE VARIABLE CSS
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/productos" 
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-colors text-slate-500 dark:text-slate-400 shadow-sm"
            >
              <ArrowLeft size={22} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Nuevo Servicio</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Registra un nuevo concepto en tu catálogo de honorarios.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link 
              href="/productos" 
              className="flex-1 md:flex-none text-center px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </Link>
            <button 
              onClick={guardar}
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 disabled:opacity-50 text-slate-950 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Guardar Servicio
            </button>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 md:p-10">
          <form onSubmit={guardar} className="space-y-8">
            
            {/* NOMBRE Y DESCRIPCIÓN */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Tag size={14} className="text-primary" /> Nombre Identificador
                </label>
                <input 
                  required autoFocus
                  type="text" 
                  placeholder="Ej: Auditoría Contable Trimestral"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none dark:text-white transition-all text-lg font-bold"
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlignLeft size={14} className="text-primary" /> Descripción para Factura
                </label>
                <textarea 
                  rows={4}
                  placeholder="Escribe el detalle que verá el cliente en su comprobante..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none dark:text-white transition-all resize-none text-sm leading-relaxed font-medium"
                  value={form.descripcion}
                  onChange={e => setForm({...form, descripcion: e.target.value})}
                />
              </div>
            </div>

            {/* PRECIO E IVA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <DollarSign size={14} className="text-primary" /> Precio Unitario Base
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    required
                    type="number" min="0" step="0.01"
                    className="w-full pl-10 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none dark:text-white transition-all font-mono font-bold text-xl"
                    value={form.precio}
                    onChange={e => setForm({...form, precio: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Tasa de IVA Aplicable</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none dark:text-white transition-all font-bold appearance-none cursor-pointer"
                  value={form.iva}
                  onChange={e => setForm({...form, iva: e.target.value})}
                >
                  <option value="21">IVA General (21%)</option>
                  <option value="10.5">IVA Reducido (10.5%)</option>
                  <option value="27">IVA Especial (27%)</option>
                  <option value="0">Exento / No Alcanzado (0%)</option>
                </select>
              </div>
            </div>

            {/* INFO EXTRA */}
            <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 flex gap-4 items-start">
              <Info size={20} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Al guardar este servicio, aparecerá como opción de <span className="font-bold text-primary">autocompletado</span> en la pantalla de Nueva Factura, agilizando tu proceso de cobranza.
              </p>
            </div>

            {/* Botón invisible para permitir envío con 'Enter' */}
            <button type="submit" className="hidden"></button>
          </form>
        </div>
      </div>
    </div>
  );
}