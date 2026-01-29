"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Package, Trash2, ArrowLeft, 
  Loader2, Tag, AlertCircle, Edit, 
  Percent, DollarSign, TrendingUp, TrendingDown, Save, X 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  iva: number;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // RGB Default
  
  // Estados para Edición
  const [editando, setEditando] = useState<Producto | null>(null);
  const [mostrandoMasivo, setMostrandoMasivo] = useState(false);
  const [valorMasivo, setValorMasivo] = useState(0);
  const [tipoMasivo, setTipoMasivo] = useState<'porcentaje' | 'monto'>('porcentaje');

  // --- HELPER COLOR (Estandarizado) ---
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

  // 1. CARGAR DATOS
  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [resProductos, resConfig] = await Promise.all([
        supabase.from('productos').select('*').order('nombre'),
        supabase.from('configuracion').select('color_primario').single() // Traemos cualquiera para el color
      ]);

      if (resProductos.error) throw resProductos.error;
      setProductos(resProductos.data || []);

      if (resConfig.data?.color_primario) {
        setAccentColor(hexToRgb(resConfig.data.color_primario));
      }
    } catch (error) {
      toast.error('Error al sincronizar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCatalog(); }, []);

  // 2. LOGICA DE EDICIÓN INDIVIDUAL
  const guardarCambioIndividual = async () => {
    if (!editando) return;
    try {
      const { error } = await supabase
        .from('productos')
        .update({ 
          nombre: editando.nombre, 
          precio: editando.precio, 
          descripcion: editando.descripcion 
        })
        .eq('id', editando.id);

      if (error) throw error;
      toast.success("Servicio actualizado");
      setEditando(null);
      fetchCatalog();
    } catch (e) { toast.error("Error al guardar"); }
  };

  // 3. LOGICA DE AUMENTO MASIVO 🚀
  const aplicarAjusteMasivo = async (direccion: 'subir' | 'bajar') => {
    if (valorMasivo <= 0) return toast.warning("Ingresa un valor válido");
    
    const confirmacion = confirm(`¿Aplicar ${direccion === 'subir' ? 'aumento' : 'reducción'} del ${valorMasivo}${tipoMasivo === 'porcentaje' ? '%' : '$'} a los servicios visibles?`);
    if (!confirmacion) return;

    try {
      setLoading(true);
      // Actualizamos uno por uno (para bases pequeñas/medianas está bien)
      const promesas = filtrados.map(p => {
        let nuevoPrecio = p.precio;
        if (tipoMasivo === 'porcentaje') {
          const factor = valorMasivo / 100;
          nuevoPrecio = direccion === 'subir' ? p.precio * (1 + factor) : p.precio * (1 - factor);
        } else {
          nuevoPrecio = direccion === 'subir' ? p.precio + valorMasivo : p.precio - valorMasivo;
        }

        // Evitamos precios negativos
        return supabase.from('productos').update({ precio: Math.max(0, nuevoPrecio) }).eq('id', p.id);
      });

      await Promise.all(promesas);
      toast.success("Precios actualizados correctamente");
      setMostrandoMasivo(false);
      fetchCatalog();
    } catch (e) {
      toast.error("Error en la actualización masiva");
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este servicio?')) return;
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (!error) {
      setProductos(productos.filter(p => p.id !== id));
      toast.success("Eliminado");
    } else {
      toast.error("No se pudo eliminar (verificar si tiene facturas)");
    }
  };

  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    // VARIABLE CSS PARA COLOR
    <div style={{ '--primary': accentColor } as React.CSSProperties} className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 shadow-sm"><ArrowLeft size={22} /></Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Catálogo de Servicios</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ajuste de honorarios y oferta profesional.</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setMostrandoMasivo(!mostrandoMasivo)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all border ${mostrandoMasivo ? 'bg-orange-500 text-white border-orange-600' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'}`}
          >
            <Percent size={18} /> Ajuste Global
          </button>
          <Link href="/productos/nuevo" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"><Plus size={20} /> Nuevo</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* PANEL DE ACTUALIZACIÓN MASIVA */}
        {mostrandoMasivo && (
          <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-6 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h4 className="font-bold text-orange-800 dark:text-orange-400 flex items-center gap-2 mb-1">
                  <TrendingUp size={18}/> Actualización de Precios en Lote
                </h4>
                <p className="text-orange-700/70 dark:text-orange-400/60 text-xs">Se aplicará a los <b>{filtrados.length}</b> servicios visibles.</p>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-orange-100 dark:border-slate-700">
                <button onClick={() => setTipoMasivo('porcentaje')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${tipoMasivo === 'porcentaje' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}><Percent size={14}/></button>
                <button onClick={() => setTipoMasivo('monto')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${tipoMasivo === 'monto' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}><DollarSign size={14}/></button>
                <input 
                  type="number" 
                  value={valorMasivo} 
                  onChange={e => setValorMasivo(Number(e.target.value))}
                  className="w-20 bg-transparent text-center font-bold text-slate-800 dark:text-white outline-none"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => aplicarAjusteMasivo('subir')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"><TrendingUp size={16}/> Aumentar</button>
                <button onClick={() => aplicarAjusteMasivo('bajar')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"><TrendingDown size={16}/> Reducir</button>
              </div>
            </div>
          </div>
        )}

        {/* BUSCADOR */}
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center">
          <Search className="ml-4 text-slate-400" size={20} />
          <input type="text" placeholder="Filtrar servicios..." className="w-full px-4 py-3 bg-transparent text-slate-700 dark:text-white outline-none font-medium" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        {/* LISTADO */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} /><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sincronizando...</span></div>
          ) : filtrados.length === 0 ? (
            <div className="p-20 text-center text-slate-400"><Package size={64} className="mx-auto mb-4 opacity-10 text-primary" /><p className="text-lg font-medium">Vacío</p></div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtrados.map(prod => (
                <div key={prod.id} className="p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 flex flex-col md:flex-row items-center justify-between group transition-all">
                  
                  {/* MODO EDICIÓN vs MODO LECTURA */}
                  {editando?.id === prod.id ? (
                    <div className="flex flex-col md:flex-row items-end gap-4 w-full animate-in fade-in duration-200">
                      <div className="flex-1 space-y-3 w-full">
                        <input type="text" value={editando.nombre} onChange={e => setEditando({...editando, nombre: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-bold dark:text-white outline-none ring-2 ring-primary/20" />
                        <input type="text" value={editando.descripcion} onChange={e => setEditando({...editando, descripcion: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm dark:text-slate-300 outline-none" />
                      </div>
                      <div className="w-full md:w-32">
                        <input type="number" value={editando.precio} onChange={e => setEditando({...editando, precio: Number(e.target.value)})} className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-black text-primary text-right outline-none ring-2 ring-primary/20" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={guardarCambioIndividual} className="p-3 bg-primary text-white rounded-xl shadow-lg hover:brightness-110 transition-all"><Save size={20}/></button>
                        <button onClick={() => setEditando(null)} className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-300 transition-all"><X size={20}/></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-5 flex-1 w-full overflow-hidden">
                        <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform"><Tag size={24} /></div>
                        <div className="overflow-hidden text-left">
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-primary transition-colors">{prod.nombre}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md italic">{prod.descripcion || 'Sin descripción'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100 dark:border-slate-800">
                        <div className="text-left md:text-right">
                          <p className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">$ {prod.precio.toLocaleString('es-AR')}</p>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">IVA {prod.iva}% incluido</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditando(prod)} className="p-3 text-slate-300 dark:text-slate-600 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit size={20} /></button>
                          <button onClick={() => eliminarProducto(prod.id)} className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && (
          <div className="flex items-center gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 text-slate-600 dark:text-slate-400 text-sm">
            <AlertCircle size={18} className="text-primary" />
            <p>Los precios actualizados se reflejarán inmediatamente en las <span className="font-bold text-primary">Nuevas Facturas</span>.</p>
          </div>
        )}
      </div>
    </div>
  );
}