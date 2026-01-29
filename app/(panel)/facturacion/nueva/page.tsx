"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Trash2, Plus, Package, User, Building2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Cliente {
  id: number;
  razon_social: string;
  cuit: string;
  condicion_iva: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  iva: number;
}

interface Emisor {
  id: number;
  nombre_empresa: string;
  color_primario: string;
}

// 1. WRAPPER PARA SEARCH PARAMS
export default function NuevaFacturaPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="animate-spin text-slate-400" /></div>}>
      <NuevaFacturaContent />
    </Suspense>
  );
}

function NuevaFacturaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cloneId = searchParams.get('cloneId');
  
  const [loading, setLoading] = useState(false);
  
  // ESTADOS PARA MULTI-EMISOR
  const [emisores, setEmisores] = useState<Emisor[]>([]);
  const [emisorId, setEmisorId] = useState<number | null>(null);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // RGB Default

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [vencimiento, setVencimiento] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([
    { id: 1, descripcion: '', cantidad: 1, precioUnitario: 0, iva: 21 }
  ]);

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

  // --- CARGAR DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClientes, resProductos, resEmisores] = await Promise.all([
          supabase.from('clientes').select('id, razon_social, cuit, condicion_iva').order('razon_social'),
          supabase.from('productos').select('*').order('nombre'),
          supabase.from('configuracion').select('*').order('id')
        ]);

        const listaClientes = resClientes.data || [];
        setClientes(listaClientes);
        setProductos(resProductos.data || []);
        
        const listaEmisores = resEmisores.data || [];
        setEmisores(listaEmisores);

        // Seleccionamos el primer emisor por defecto
        if (listaEmisores.length > 0) {
          setEmisorId(listaEmisores[0].id);
          if (listaEmisores[0].color_primario) {
              setAccentColor(hexToRgb(listaEmisores[0].color_primario));
          }
        }

        // LÓGICA DE CLONADO
        if (cloneId) {
          const { data: fact } = await supabase
            .from('facturas')
            .select('*, detalles_factura(*)')
            .eq('id', cloneId)
            .single();

          if (fact) {
            const clienteOriginal = listaClientes.find(c => c.id === fact.cliente_id);
            if (clienteOriginal) setClienteSeleccionado(clienteOriginal);
            
            // Si clonamos, tratamos de mantener el mismo emisor
            if (fact.emisor_id) {
               const emisorOriginal = listaEmisores.find(e => e.id === fact.emisor_id);
               if (emisorOriginal) {
                 setEmisorId(emisorOriginal.id);
                 if(emisorOriginal.color_primario) setAccentColor(hexToRgb(emisorOriginal.color_primario));
               }
            }
            
            const itemsClonados = fact.detalles_factura.map((d: any, idx: number) => ({
              id: Date.now() + idx,
              descripcion: d.descripcion,
              cantidad: d.cantidad,
              precioUnitario: d.precio_unitario,
              iva: d.iva
            }));
            
            setItems(itemsClonados);
            toast.success("Datos clonados correctamente");
          }
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
        toast.error("Error de conexión");
      }
    };
    fetchData();
  }, [cloneId]);

  // Cambiar color cuando cambia el emisor
  const handleEmisorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setEmisorId(id);
    const emisor = emisores.find(em => em.id === id);
    if (emisor?.color_primario) {
       setAccentColor(hexToRgb(emisor.color_primario));
    }
  };

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setClienteSeleccionado(clientes.find(c => c.id === id) || null);
  };

  const agregarLinea = () => {
    const nuevoId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: nuevoId, descripcion: '', cantidad: 1, precioUnitario: 0, iva: 21 }]);
  };

  const eliminarLinea = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const actualizarItem = (id: number, campo: string, valor: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [campo]: valor } : i));
  };

  const cargarProductoEnLinea = (itemId: number, productoId: string) => {
    const prod = productos.find(p => p.id === Number(productoId));
    if (prod) {
      setItems(items.map(i => i.id === itemId ? {
        ...i,
        descripcion: prod.nombre + (prod.descripcion ? ` - ${prod.descripcion}` : ''),
        precioUnitario: prod.precio,
        iva: prod.iva
      } : i));
    }
  };

  const guardarFactura = async () => {
    if (!emisorId) return toast.error("Selecciona un emisor para la factura.");
    if (!clienteSeleccionado) return toast.error("Selecciona un cliente.");
    if (items.some(i => i.descripcion === '' || i.precioUnitario <= 0)) return toast.error("Completa los datos de todos los ítems.");

    setLoading(true);
    try {
      const subtotalFinal = items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
      const totalIvaFinal = items.reduce((acc, item) => acc + ((item.cantidad * item.precioUnitario) * (item.iva / 100)), 0);
      
      const { data: facturaData, error: facturaError } = await supabase
        .from('facturas')
        .insert([{
            emisor_id: emisorId, // GUARDA EL EMISOR CORRECTO
            cliente_id: clienteSeleccionado.id,
            fecha,
            vencimiento,
            subtotal: subtotalFinal,
            total_iva: totalIvaFinal,
            total: subtotalFinal + totalIvaFinal,
            estado: 'Pendiente'
        }]).select().single();

      if (facturaError) throw facturaError;
      
      const detalles = items.map(item => ({
        factura_id: facturaData.id,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precioUnitario,
        iva: item.iva,
        subtotal: item.cantidad * item.precioUnitario
      }));

      const { error: dError } = await supabase.from('detalles_factura').insert(detalles);
      if (dError) throw dError;

      toast.success("Factura emitida correctamente");
      router.push('/facturacion');
      router.refresh();
    } catch (err: any) {
      toast.error("Error al emitir: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
  const totalIva = items.reduce((acc, item) => acc + ((item.cantidad * item.precioUnitario) * (item.iva / 100)), 0);

  return (
    // INYECCIÓN DE VARIABLE CSS
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300 pb-32"
    >
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/facturacion" 
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-colors text-slate-500 dark:text-slate-400 shadow-sm"
          >
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {cloneId ? "Clonar Factura" : "Nueva Factura"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Sistema Multi-Emisor.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/facturacion" className="flex-1 md:flex-none text-center px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancelar</Link>
          <button 
            onClick={guardarFactura} 
            disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 disabled:opacity-50 text-slate-950 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {cloneId ? "Emitir Clon" : "Emitir Factura"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* SELECTOR DE EMISOR Y CLIENTE UNIFICADO */}
        <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
          
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. SELECCIÓN DE EMISOR (QUIÉN FACTURA) */}
            <div>
               <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Building2 size={12} className="text-primary" /> Emisor (Tu Empresa)
               </label>
               {emisores.length === 0 ? (
                 <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl font-bold border border-red-200 dark:border-red-900/50 flex items-center gap-2">
                    <AlertCircle size={18}/> No hay perfiles configurados.
                 </div>
               ) : (
                 <select 
                   value={emisorId || ''}
                   onChange={handleEmisorChange}
                   className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                 >
                   {emisores.map(e => (
                     <option key={e.id} value={e.id}>{e.nombre_empresa}</option>
                   ))}
                 </select>
               )}
            </div>

            {/* 2. SELECCIÓN DE CLIENTE (A QUIÉN LE FACTURAS) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User size={12} className="text-primary" /> Receptor del Comprobante
              </label>
              <select 
                value={clienteSeleccionado?.id || ''}
                onChange={handleClienteChange}
                className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="">Seleccionar Cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
              </select>
              {clienteSeleccionado && (
                <div className="mt-3 flex gap-4 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/10 w-fit">
                  <p>CUIT: {clienteSeleccionado.cuit}</p>
                  <p>Condición: {clienteSeleccionado.condicion_iva}</p>
                </div>
              )}
            </div>
          </div>

          {/* FECHAS */}
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 bg-white dark:bg-slate-900">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Fecha de Emisión</label>
                  <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Fecha de Vencimiento</label>
                  <input type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className="w-full p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" />
                </div>
          </div>
        </div>

        {/* TABLA DE ÍTEMS */}
        <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left mb-8 min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <th className="pb-4 w-[45%]">Detalle del Servicio / Honorarios</th>
                  <th className="pb-4 text-center w-[10%]">Cant.</th>
                  <th className="pb-4 text-right w-[15%]">Unitario</th>
                  <th className="pb-4 text-center w-[10%]">IVA</th>
                  <th className="pb-4 text-right w-[15%]">Subtotal</th>
                  <th className="pb-4 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id} className="group transition-all">
                    <td className="py-4 pr-4">
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                          <select 
                            className="w-full pl-9 pr-3 py-1.5 text-[11px] font-bold bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-lg text-primary outline-none cursor-pointer hover:bg-primary/10 transition-colors appearance-none"
                            onChange={(e) => cargarProductoEnLinea(item.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Seleccionar del catálogo...</option>
                            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} — $ {p.precio}</option>)}
                          </select>
                        </div>
                        <input 
                          type="text" placeholder="Descripción manual..." 
                          className="w-full p-2.5 bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white transition-all text-sm font-medium"
                          value={item.descripcion}
                          onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-2 align-bottom">
                      <input type="number" min="1" className="w-full p-2.5 text-center bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 outline-none dark:text-white transition-all font-bold" value={item.cantidad} onChange={e => actualizarItem(item.id, 'cantidad', parseFloat(e.target.value) || 0)} />
                    </td>
                    <td className="py-4 px-2 align-bottom text-right">
                      <input type="number" className="w-full p-2.5 text-right bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 outline-none dark:text-white transition-all font-bold" value={item.precioUnitario} onChange={e => actualizarItem(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)} />
                    </td>
                    <td className="py-4 px-2 align-bottom">
                      <select className="w-full p-2.5 bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 outline-none text-xs dark:text-white cursor-pointer" value={String(item.iva)} onChange={e => actualizarItem(item.id, 'iva', parseFloat(e.target.value))}>
                        <option value="21">21%</option>
                        <option value="10.5">10.5%</option>
                        <option value="0">0%</option>
                      </select>
                    </td>
                    <td className="py-4 pl-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300 align-bottom">
                      $ {(item.cantidad * item.precioUnitario).toLocaleString('es-AR')}
                    </td>
                    <td className="py-4 text-right align-bottom">
                      <button onClick={() => eliminarLinea(item.id)} className="text-slate-300 hover:text-red-500 dark:text-slate-700 dark:hover:text-red-400 p-2 transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={agregarLinea} className="flex items-center gap-2 text-xs font-bold text-primary hover:brightness-90 uppercase tracking-widest bg-primary/10 px-5 py-3 rounded-2xl transition-all shadow-sm">
            <Plus size={16} /> Agregar ítem manual
          </button>
        </div>

        {/* PIE DE PÁGINA: TOTALES */}
        <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row justify-end gap-12">
          <div className="w-full md:w-96 space-y-4">
            <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
              <span>Subtotal Neto</span>
              <span className="font-mono text-slate-900 dark:text-slate-200">$ {subtotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
              <span>IVA Total Calculado</span>
              <span className="font-mono text-slate-900 dark:text-slate-200">$ {totalIva.toLocaleString('es-AR')}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">TOTAL FINAL</span>
              <span className="font-bold text-3xl text-primary font-mono tracking-tighter">
                $ {(subtotal + totalIva).toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}