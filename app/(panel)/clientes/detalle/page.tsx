"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // <--- CAMBIO 1
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  TrendingUp, AlertCircle, 
  CheckCircle2, Clock, MoreVertical,
  Download, Printer, Trash2, Edit2, Loader2,
  History, X, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { logAction } from '@/lib/audit';

// ------------------------------------------------------------------
// 1. COMPONENTE INTERNO (LÓGICA REAL)
// ------------------------------------------------------------------
function ContenidoDetalleCliente() {
  const searchParams = useSearchParams(); // <--- CAMBIO 2: Leer ?id=...
  const router = useRouter();
  const id = searchParams.get('id');      // <--- CAMBIO 3: Obtener el ID
  
  // Estados de Datos
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<any>(null);
  const [facturas, setFacturas] = useState<any[]>([]);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // Color default

  // Estados para Modal de Anulación
  const [facturaAAnular, setFacturaAAnular] = useState<any>(null);
  const [motivoAnulacion, setMotivoAnulacion] = useState('');
  const [procesandoAnulacion, setProcesandoAnulacion] = useState(false);

  useEffect(() => {
    if (!id) return; // Si no hay ID, esperamos o redirigimos (manejado abajo)

    const fetchData = async () => {
      try {
        const [resCliente, resFacturas, resConfig] = await Promise.all([
          supabase.from('clientes').select('*').eq('id', id).single(),
          supabase.from('facturas').select('*').eq('cliente_id', id).order('fecha_emision', { ascending: false }),
          supabase.from('configuracion').select('color_primario').single()
        ]);

        if (resCliente.error) throw resCliente.error;
        setCliente(resCliente.data);
        setFacturas(resFacturas.data || []);

        if (resConfig.data?.color_primario) {
          const hex = resConfig.data.color_primario.replace('#', '');
          setAccentColor(`${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`);
        }

      } catch (error) {
        console.error(error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Si no hay ID en la URL, sacamos al usuario
  useEffect(() => {
    if (!id && !loading) {
       router.push('/clientes');
    }
  }, [id, loading, router]);


  // --- LÓGICA DE ANULACIÓN (TU CÓDIGO ORIGINAL) ---
  const iniciarAnulacion = (f: any) => {
    if (f.estado === 'Anulada') return toast.error("Esta factura ya está anulada");
    setFacturaAAnular(f);
    setMotivoAnulacion('');
  };

  const confirmarAnulacion = async () => {
    if (!motivoAnulacion.trim()) return toast.warning("Por favor, escribí un motivo para la auditoría.");
    
    setProcesandoAnulacion(true);
    try {
      const { error } = await supabase
        .from('facturas')
        .update({ 
          anulada: true, 
          motivo_anulacion: motivoAnulacion,
          estado: 'Anulada' 
        })
        .eq('id', facturaAAnular.id);

      if (error) throw error;

      await logAction('factura', facturaAAnular.id.toString(), 'ANULAR', facturaAAnular, { ...facturaAAnular, estado: 'Anulada', motivo_anulacion: motivoAnulacion });
      
      toast.success("Factura anulada correctamente");
      
      setFacturas(facturas.map(fact => fact.id === facturaAAnular.id ? { ...fact, estado: 'Anulada' } : fact));
      setFacturaAAnular(null);
      
    } catch (error) {
      toast.error("Error al anular la factura");
    } finally {
      setProcesandoAnulacion(false);
    }
  };

  const deudaTotal = facturas
    .filter(f => f.estado !== 'Pagada' && f.estado !== 'Anulada')
    .reduce((acc, curr) => acc + (curr.total || 0), 0);

  const facturasPendientes = facturas.filter(f => f.estado === 'Pendiente').length;

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-slate-400" size={40} />
    </div>
  );

  if (!cliente) return <div className="p-10 text-center">Cliente no encontrado</div>;

  return (
    <div style={{ '--primary': accentColor } as React.CSSProperties} className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/clientes" className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm hover:text-primary hover:border-primary/30 transition-all">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{cliente.razon_social}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">CUIT: {cliente.cuit || 'No disponible'}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           {/* OJO: Aquí actualicé el link de EDITAR también para usar ?id= */}
           <Link href={`/clientes/editar?id=${id}`} className="flex-1 md:flex-none justify-center flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-slate-500 hover:text-primary transition-colors">
             <Edit2 size={20} />
           </Link>
           <Link href="/reportes" className="flex-1 md:flex-none justify-center flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-slate-500 hover:text-primary transition-colors">
             <History size={20} />
           </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA (Info y Deuda) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest opacity-50">Datos de Contacto</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"><Mail size={20} /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{cliente.email || 'Sin correo'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Teléfono</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{cliente.telefono || 'Sin teléfono'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 relative z-10">Deuda Real</p>
            <h4 className="text-3xl font-black text-white mb-4 relative z-10">$ {deudaTotal.toLocaleString('es-AR')}</h4>
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 w-fit px-3 py-1.5 rounded-full relative z-10">
              <AlertCircle size={14} /> {facturasPendientes} Pendientes
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (Tabla) */}
        <div className="lg:col-span-8 space-y-6 pb-20">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Historial</h3>
                <Link href={`/facturacion/nueva?cliente=${id}`} className="w-full sm:w-auto text-center bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                  Nueva Factura
                </Link>
             </div>
             
             <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left min-w-[600px]">
                 <thead>
                   <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800/50">
                     <th className="px-8 py-4 font-black">Comprobante</th>
                     <th className="px-4 py-4 font-black text-right">Monto</th>
                     <th className="px-4 py-4 font-black text-center">Estado</th>
                     <th className="px-8 py-4 text-right font-black">Acciones</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                   {facturas.map((f) => (
                     <tr key={f.id} className={`group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${f.estado === 'Anulada' ? 'opacity-50' : ''}`}>
                       <td className="px-8 py-5">
                         <div className="flex flex-col">
                           <span className={`text-sm font-bold ${f.estado === 'Anulada' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                             #{f.numero || f.id.toString().slice(0,6)}
                           </span>
                           <span className="text-[11px] text-slate-400">{new Date(f.fecha_emision).toLocaleDateString()}</span>
                         </div>
                       </td>
                       <td className="px-4 py-5 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                         $ {f.total?.toLocaleString()}
                       </td>
                       <td className="px-4 py-5">
                         <div className={`mx-auto w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 ${
                           f.estado === 'Pagada' ? 'bg-emerald-500/10 text-emerald-500' : 
                           f.estado === 'Anulada' ? 'bg-slate-500/10 text-slate-500' : 
                           f.estado === 'Vencida' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                         }`}>
                           {f.estado === 'Anulada' ? <AlertCircle size={12} /> : f.estado === 'Pagada' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                           {f.estado}
                         </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                         <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Printer size={16} /></button>
                            <button 
                              onClick={() => iniciarAnulacion(f)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              title="Anular Factura"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE ANULACIÓN --- */}
      {facturaAAnular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Anular Factura</h3>
                  <p className="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
                </div>
              </div>
              <button onClick={() => setFacturaAAnular(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Factura Seleccionada</p>
              <p className="text-slate-900 dark:text-white font-mono font-bold">#{facturaAAnular.numero || facturaAAnular.id}</p>
              <p className="text-slate-900 dark:text-white font-mono font-bold">$ {facturaAAnular.total?.toLocaleString()}</p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Motivo de anulación (Obligatorio)
              </label>
              <textarea 
                autoFocus
                value={motivoAnulacion}
                onChange={(e) => setMotivoAnulacion(e.target.value)}
                placeholder="Ej: Error en el monto, Cliente devolvió mercadería..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-red-500 transition-colors text-sm min-h-[100px] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setFacturaAAnular(null)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarAnulacion}
                disabled={procesandoAnulacion || !motivoAnulacion.trim()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
              >
                {procesandoAnulacion ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                Confirmar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ------------------------------------------------------------------
// 2. COMPONENTE PADRE (WRAPPER CON SUSPENSE)
// ------------------------------------------------------------------
export default function DetalleClientePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-slate-400" size={40} />
      </div>
    }>
      <ContenidoDetalleCliente />
    </Suspense>
  );
}