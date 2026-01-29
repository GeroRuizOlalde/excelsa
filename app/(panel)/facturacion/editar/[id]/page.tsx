"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Loader2, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner'; // Usamos Sonner para consistencia

interface Item {
  id: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  iva: number;
}

export default function EditarFacturaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [facturaId, setFacturaId] = useState<string | null>(null);
  
  // Color por defecto (RGB para Tailwind)
  const [accentColor, setAccentColor] = useState('208, 255, 0'); 

  // Estados del formulario
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState<number | string>("");
  const [fecha, setFecha] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  // Helper para convertir HEX a RGB (Necesario para Tailwind opacity)
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

  // 1. DESENVOLVER PARAMS
  useEffect(() => {
    params.then(p => setFacturaId(p.id));
  }, [params]);

  // 2. CARGAR DATOS (PARALELO)
  useEffect(() => {
    if (!facturaId) return;

    const cargarDatos = async () => {
      try {
        // Ejecutamos las 3 peticiones en paralelo para que cargue instantáneo
        const [resClientes, resFactura, resConfig] = await Promise.all([
            supabase.from('clientes').select('id, razon_social').order('razon_social'),
            supabase.from('facturas').select('*, detalles_factura(*)').eq('id', facturaId).single(),
            supabase.from('configuracion').select('color_primario').single()
        ]);

        // 1. Configurar Color
        if (resConfig.data?.color_primario) {
            setAccentColor(hexToRgb(resConfig.data.color_primario));
        }

        // 2. Configurar Clientes
        setClientes(resClientes.data || []);

        // 3. Configurar Factura
        if (resFactura.error) throw resFactura.error;
        const factura = resFactura.data;

        setClienteId(factura.cliente_id);
        setFecha(factura.fecha);
        setVencimiento(factura.vencimiento);

        // Mapear ítems
        const itemsFormateados = factura.detalles_factura.map((d: any) => ({
          id: d.id, // Usamos ID real para key, pero cuidado al borrar/crear
          descripcion: d.descripcion,
          cantidad: d.cantidad,
          precioUnitario: d.precio_unitario,
          iva: d.iva
        }));
        setItems(itemsFormateados);

      } catch (error) {
        console.error(error);
        toast.error("Error al cargar la factura");
        router.push('/facturacion');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [facturaId, router]);

  // 3. LÓGICA DE GUARDADO
  const actualizarFactura = async () => {
    if (!clienteId || items.length === 0) return toast.warning("Faltan datos obligatorios (Cliente o Ítems)");
    setGuardando(true);

    try {
      const subtotalFinal = items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
      const totalIvaFinal = items.reduce((acc, item) => acc + ((item.cantidad * item.precioUnitario) * (item.iva / 100)), 0);
      const totalFinal = subtotalFinal + totalIvaFinal;

      // 1. Actualizar Cabecera
      const { error: errorCabecera } = await supabase
        .from('facturas')
        .update({
          cliente_id: Number(clienteId),
          fecha,
          vencimiento,
          subtotal: subtotalFinal,
          total_iva: totalIvaFinal,
          total: totalFinal
        })
        .eq('id', facturaId);

      if (errorCabecera) throw errorCabecera;

      // 2. Actualizar Ítems (Estrategia: Borrar y Recrear es más seguro para ediciones complejas)
      // Primero borramos los anteriores
      await supabase.from('detalles_factura').delete().eq('factura_id', facturaId);

      // Preparamos los nuevos
      const nuevosDetalles = items.map(item => ({
        factura_id: Number(facturaId),
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precioUnitario,
        iva: item.iva,
        subtotal: item.cantidad * item.precioUnitario
      }));

      const { error: errorDetalles } = await supabase.from('detalles_factura').insert(nuevosDetalles);
      if (errorDetalles) throw errorDetalles;

      toast.success("¡Factura actualizada correctamente!");
      router.push('/facturacion');
      router.refresh();

    } catch (error: any) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const agregarLinea = () => setItems([...items, { id: Date.now(), descripcion: '', cantidad: 1, precioUnitario: 0, iva: 21 }]);
  const eliminarLinea = (id: number) => items.length > 1 ? setItems(items.filter(i => i.id !== id)) : toast.warning("Debe haber al menos un ítem");
  const actualizarItem = (id: number, campo: string, valor: any) => setItems(items.map(i => i.id === id ? { ...i, [campo]: valor } : i));

  // Cálculos en tiempo real para visualización
  const subtotal = items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
  const totalIva = items.reduce((acc, item) => acc + ((item.cantidad * item.precioUnitario) * (item.iva / 100)), 0);
  const total = subtotal + totalIva;

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 gap-3 transition-colors duration-300">
      <Loader2 className="animate-spin text-primary" size={32} />
      <span className="font-bold font-sans uppercase tracking-widest text-xs">Cargando Factura...</span>
    </div>
  );

  return (
    // INYECTAMOS LA VARIABLE CSS RGB CORRECTAMENTE
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300 pb-32"
    >
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/facturacion" 
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 shadow-sm"
          >
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Editar Factura</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Modificar ítems y valores.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link 
            href="/facturacion" 
            className="flex-1 md:flex-none text-center px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </Link>
          <button 
            onClick={actualizarFactura}
            disabled={guardando}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
          >
            {guardando ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
        
        {/* ENCABEZADO DE FORMULARIO */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <User size={12} className="text-primary" /> Cliente Receptor
            </label>
            <select 
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">Seleccionar Cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Fecha Emisión</label>
                <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white transition-all" />
             </div>
             <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Vencimiento</label>
                <input type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className="w-full p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white transition-all" />
             </div>
          </div>
        </div>

        {/* TABLA DE ÍTEMS DINÁMICA */}
        <div className="p-6 md:p-8">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left mb-8 min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <th className="pb-4 w-[40%]">Descripción del Servicio / Producto</th>
                  <th className="pb-4 text-center w-[10%]">Cant.</th>
                  <th className="pb-4 text-right w-[15%]">Precio Unit.</th>
                  <th className="pb-4 text-center w-[15%]">% IVA</th>
                  <th className="pb-4 text-right w-[15%]">Subtotal</th>
                  <th className="pb-4 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id} className="group">
                    <td className="py-4 pr-4">
                      <input 
                        type="text" 
                        placeholder="Ej: Honorarios Mensuales"
                        value={item.descripcion}
                        onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)}
                        className="w-full p-2.5 bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white transition-all font-medium"
                      />
                    </td>
                    <td className="py-4 px-2">
                      <input 
                        type="number" min="1"
                        value={item.cantidad}
                        onChange={(e) => actualizarItem(item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 text-center bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 outline-none dark:text-white transition-all font-bold"
                      />
                    </td>
                    <td className="py-4 px-2">
                      <input 
                        type="number" min="0"
                        value={item.precioUnitario}
                        onChange={(e) => actualizarItem(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 text-right bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 outline-none dark:text-white transition-all font-bold"
                      />
                    </td>
                    <td className="py-4 px-2 text-center">
                      <select
                        value={item.iva}
                        onChange={(e) => actualizarItem(item.id, 'iva', parseFloat(e.target.value))}
                        className="p-2.5 bg-transparent border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 outline-none text-sm dark:text-white cursor-pointer transition-all font-bold text-slate-500"
                      >
                        <option value={21}>21%</option>
                        <option value={10.5}>10.5%</option>
                        <option value={27}>27%</option>
                        <option value={0}>0%</option>
                      </select>
                    </td>
                    <td className="py-4 pl-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                      $ {(item.cantidad * item.precioUnitario).toLocaleString('es-AR')}
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => eliminarLinea(item.id)} className="text-slate-300 hover:text-red-500 dark:text-slate-700 dark:hover:text-red-400 p-2 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            onClick={agregarLinea} 
            className="flex items-center gap-2 text-xs font-bold text-primary hover:brightness-90 uppercase tracking-widest bg-primary/10 px-4 py-2.5 rounded-xl transition-all"
          >
            <Plus size={16} /> Agregar ítem
          </button>
        </div>

        {/* SECCIÓN DE TOTALES */}
        <div className="bg-slate-50/80 dark:bg-slate-800/50 p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <div className="w-full md:w-96 space-y-4">
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>Subtotal Neto</span>
              <span className="font-mono text-slate-900 dark:text-slate-200">$ {subtotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>IVA Total Calculado</span>
              <span className="font-mono text-slate-900 dark:text-slate-200">$ {totalIva.toLocaleString('es-AR')}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">TOTAL FACTURADO</span>
              <span className="font-bold text-3xl text-primary font-mono tracking-tighter">
                $ {total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}