"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Filter, MoreVertical, Phone, ArrowLeft, 
  Loader2, AlertCircle, Trash2, Edit, PauseCircle, CheckCircle,
  TrendingDown, AlertTriangle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Cliente {
  id: number;
  razon_social: string;
  cuit: string;
  condicion_iva: string;
  contacto: string;
  deuda_total: number;
  estado: string;
  telefono: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // Color default

  // --- CARGA DE DATOS (Clientes + Config) ---
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [resClientes, resConfig] = await Promise.all([
        supabase.from('clientes').select('*').order('id', { ascending: false }),
        supabase.from('configuracion').select('color_primario').single()
      ]);

      if (resClientes.error) throw resClientes.error;
      setClientes(resClientes.data || []);

      // Configurar Color
      if (resConfig.data?.color_primario) {
        const hex = resConfig.data.color_primario.replace('#', '');
        setAccentColor(`${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error("No se pudo cargar la cartera de clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const eliminarCliente = async (id: number) => {
    const promesa = new Promise(async (resolve, reject) => {
        try {
            const { error } = await supabase.from('clientes').delete().eq('id', id);
            
            if (error) {
                if (error.code === '23503') {
                    reject("No se puede eliminar: El cliente tiene facturas o historial asociado.");
                    return;
                }
                throw error;
            }
            
            // Actualizamos estado localmente para no recargar toda la base
            setClientes(prev => prev.filter(c => c.id !== id));
            resolve("Cliente eliminado");
            
        } catch (err: any) {
            reject(err.message || "Error al eliminar");
        }
    });

    toast.promise(promesa, {
        loading: 'Eliminando cliente...',
        success: (msg) => `${msg}`,
        error: (msg) => `${msg}`,
    });
  };

  const alternarEstado = async (cliente: Cliente) => {
    const nuevoEstado = cliente.estado === 'Suspendido' ? 'Al día' : 'Suspendido';
    try {
      const { error } = await supabase.from('clientes').update({ estado: nuevoEstado }).eq('id', cliente.id);
      if (error) throw error;
      
      setClientes(clientes.map(c => c.id === cliente.id ? { ...c, estado: nuevoEstado } : c));
      setMenuAbierto(null);
      
      toast.success(nuevoEstado === 'Suspendido' ? 'Cliente suspendido temporalmente' : 'Cliente reactivado');
    } catch (error: any) {
      toast.error('Error al actualizar estado');
    }
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.cuit.includes(busqueda)
  );

  const deudaCarteraTotal = clientes.reduce((acc, c) => acc + (c.deuda_total || 0), 0);

  return (
    // INYECCIÓN DE VARIABLE CSS
    <div style={{ '--primary': accentColor } as React.CSSProperties} className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300" onClick={() => setMenuAbierto(null)}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-colors text-slate-500 dark:text-slate-400 shadow-sm">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Cartera de Clientes</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">Gestión de activos y saldos pendientes.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden lg:flex flex-col items-end px-4 border-r border-slate-200 dark:border-slate-800 mr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo Pendiente Total</span>
                <span className="text-lg font-black text-red-500 font-mono">$ {deudaCarteraTotal.toLocaleString('es-AR')}</span>
            </div>
            <Link 
              href="/clientes/nuevo" 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={20} /> Nuevo Cliente
            </Link>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" placeholder="Buscar por Razón Social o CUIT..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 dark:text-white transition-all font-medium"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-sm">
          <Filter size={18} /> Filtros
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[400px] overflow-visible">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <Loader2 size={48} className="animate-spin mb-4 text-primary" />
            <p className="font-bold uppercase tracking-widest text-xs">Sincronizando Cartera...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <AlertCircle size={48} className="mb-4 text-slate-200 dark:text-slate-800" />
            <p className="font-medium text-lg">No se encontraron clientes</p>
            <p className="text-sm">Intenta con otro término de búsqueda.</p>
          </div>
        ) : (
          <div className="relative overflow-x-auto overflow-y-visible pb-24 custom-scrollbar">
            <table className="w-full text-left text-sm border-separate border-spacing-0 overflow-visible">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Cliente</th>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Identificación</th>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Contacto</th>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Indicador de Deuda</th>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Estado</th>
                  <th className="px-6 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clientesFiltrados.map((cliente) => {
                  const mostrarEstadoMora = cliente.deuda_total > 0 && cliente.estado === 'Al día';
                  const estadoVisual = mostrarEstadoMora ? 'Mora' : cliente.estado;

                  return (
                    <tr key={cliente.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-900 dark:text-white text-base tracking-tight">{cliente.razon_social}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {cliente.id}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono text-slate-600 dark:text-slate-400 font-bold">{cliente.cuit}</div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase mt-1">
                          {cliente.condicion_iva}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary/60"><Phone size={14} /></div>
                          <span className="text-xs font-bold tracking-tight">{cliente.telefono || cliente.contacto || 'N/A'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {cliente.deuda_total > 0 ? (
                          <div className="inline-flex flex-col items-end">
                              <div className="flex items-center gap-1.5 text-red-500 font-black text-base font-mono">
                                  <AlertTriangle size={14} />
                                  $ {cliente.deuda_total.toLocaleString('es-AR')}
                              </div>
                              <span className="text-[9px] font-black text-red-400/70 uppercase tracking-tighter italic">Saldo Vencido</span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-end opacity-40">
                              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-sm font-mono">
                                  <CheckCircle size={14} className="text-emerald-500" />
                                  $ 0,00
                              </div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Sin deudas</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.1em]
                          ${estadoVisual === 'Al día' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}
                          ${estadoVisual === 'Suspendido' ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-600 line-through' : ''}
                          ${estadoVisual === 'Mora' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 animate-pulse' : ''}
                        `}>
                          {estadoVisual}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right relative overflow-visible">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAbierto(menuAbierto === cliente.id ? null : cliente.id);
                          }}
                          className={`p-2.5 rounded-xl transition-all relative z-10 ${menuAbierto === cliente.id ? 'text-primary bg-primary/10 rotate-90 scale-110 shadow-inner' : 'text-slate-300 hover:text-primary'}`}
                        >
                          <MoreVertical size={20} />
                        </button>

                        {menuAbierto === cliente.id && (
                          <div className="absolute right-10 top-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-700 z-[100] overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200 text-left">
                            <Link href={`/clientes/editar/${cliente.id}`} className="w-full text-left px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors font-bold">
                              <Edit size={16} className="text-slate-400" />
                              Editar Perfil
                            </Link>

                            <button 
                              onClick={() => alternarEstado(cliente)}
                              className="w-full text-left px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 border-t border-slate-100 dark:border-slate-700 transition-colors font-bold"
                            >
                              {cliente.estado === 'Suspendido' ? (
                                <>
                                  <CheckCircle size={16} className="text-emerald-500" /> Rehabilitar Cliente
                                </>
                              ) : (
                                <>
                                  <PauseCircle size={16} className="text-orange-500" /> Suspender Cuenta
                                </>
                              )}
                            </button>

                            <button 
                              onClick={() => eliminarCliente(cliente.id)}
                              className="w-full text-left px-5 py-3.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 border-t border-slate-100 dark:border-slate-700 transition-colors font-black"
                            >
                              <Trash2 size={16} /> Eliminar Registro
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}