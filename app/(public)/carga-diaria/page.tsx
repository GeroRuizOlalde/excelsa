"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // <--- CAMBIO 1
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, TrendingDown, Plus, 
  Mountain, Loader2, Trash2,
  AlertCircle, RefreshCw, Calendar,
  Wallet, Save, Landmark, Monitor, LogOut
} from 'lucide-react';
import { toast } from 'sonner';

// --- CATEGORÍAS (Sin cambios) ---
const CATEGORIAS = {
  ingreso: [
    { id: 'ventas_totales', label: 'Venta / Cobro Cliente' },
    { id: 'prestamos_bancarios', label: 'Préstamo Recibido' },
    { id: 'aporte_socios', label: 'Aporte de Capital (Dueños)' },
    { id: 'otros_ingresos', label: 'Otros Ingresos' },
  ],
  egreso: [
    { id: 'costo_ventas', label: 'Compra de Mercadería / Insumos' },
    { id: 'fletes_logistica', label: 'Fletes y Logística' },
    { id: 'combustible_viaticos', label: 'Combustible y Viáticos' },
    { id: 'reparaciones', label: 'Reparaciones y Mantenimiento' },
    { id: 'compra_equipamiento', label: 'Compra de Equipamiento (Inversión)' },
    { id: 'seguros', label: 'Seguros' },
    { id: 'pago_prestamos', label: 'Pago de Préstamos' },
    { id: 'cuotas_planes', label: 'Cuotas Planes de Pago' },
    { id: 'gastos_bancarios', label: 'Gastos Bancarios' },
    { id: 'impuesto_debito_credito', label: 'Imp. Débitos y Créditos' },
    { id: 'comisiones_tarjetas', label: 'Comisiones Tarjetas' },
    { id: 'retenciones_iibb', label: 'Retenciones Ingresos Brutos' },
    { id: 'retenciones_iva', label: 'Retenciones IVA' },
    { id: 'retenciones_ganancias', label: 'Retenciones Ganancias' },
    { id: 'iva_pagado', label: 'Pago de IVA (Declaración)' },
    { id: 'ingresos_brutos', label: 'Pago IIBB (Declaración)' },
    { id: 'tasas_municipales', label: 'Tasas Municipales' },
    { id: 'cargas_sociales', label: 'Cargas Sociales (F931)' },
    { id: 'monotributo_autonomos', label: 'Monotributo / Autónomos' },
    { id: 'alquileres', label: 'Alquiler Local/Oficina' },
    { id: 'sueldos', label: 'Sueldos Netos' },
    { id: 'luz', label: 'Luz' },
    { id: 'gas', label: 'Gas' },
    { id: 'agua', label: 'Agua' },
    { id: 'internet', label: 'Internet' },
    { id: 'telefonia', label: 'Telefonía / Celular' },
    { id: 'libreria_insumos', label: 'Librería y Oficina' },
    { id: 'marketing_publicidad', label: 'Publicidad' },
    { id: 'honorarios_profesionales', label: 'Honorarios' },
    { id: 'deudas_proveedores', label: 'Pago Deuda Proveedores' },
    { id: 'retiros_socios', label: 'Retiro Socios' },
    { id: 'otros', label: 'Otros Gastos' }
  ]
};

// ------------------------------------------------------------------
// 1. COMPONENTE INTERNO (Lógica Completa)
// ------------------------------------------------------------------
function ContenidoCargaDiaria() {
  const searchParams = useSearchParams(); // <--- CAMBIO 2
  const token = searchParams.get('token'); // <--- CAMBIO 3: Leer ?token=...
  
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<any>(null);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [tipoMovimiento, setTipoMovimiento] = useState<'ingreso' | 'egreso' | 'saldos'>('ingreso'); 
  const [guardando, setGuardando] = useState(false);
  const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7)); 
  const [accentColor, setAccentColor] = useState('208, 255, 0'); 

  // FORMULARIO MOVIMIENTOS
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0], 
    monto: '',
    categoria: 'ventas_totales',
    descripcion: ''
  });

  // FORMULARIO SALDOS
  const [formSaldos, setFormSaldos] = useState({
    caja_bancos: '',
    stock_inventario: '',
    cuentas_por_cobrar: '',
    deuda_proveedores_inicial: '',
    activos_no_corrientes: '' 
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

  const cargarDatos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Cargar Configuración (Color) + Validar Cliente
      const [resConfig, resCliente] = await Promise.all([
        supabase.from('configuracion').select('color_primario').single(),
        supabase.from('clientes').select('id, razon_social').eq('token_acceso', token).single()
      ]);

      // Aplicar Color
      if (resConfig.data?.color_primario) {
        setAccentColor(hexToRgb(resConfig.data.color_primario));
      }

      // Validar Cliente
      if (resCliente.error || !resCliente.data) {
        toast.error("Enlace inválido o expirado");
        setLoading(false);
        return;
      }
      setCliente(resCliente.data);

      // 2. Cargar Movimientos
      const [anio, mes] = mesFiltro.split('-');
      const fechaInicio = `${mesFiltro}-01`;
      const ultimoDia = new Date(parseInt(anio), parseInt(mes), 0).getDate();
      const fechaFin = `${mesFiltro}-${ultimoDia}`;

      const { data: m } = await supabase
        .from('movimientos')
        .select('*')
        .eq('cliente_id', resCliente.data.id)
        .gte('fecha', fechaInicio)
        .lte('fecha', fechaFin)
        .order('fecha', { ascending: false })
        .order('created_at', { ascending: false });

      setMovimientos(m || []);

      // 3. Cargar Saldos Existentes
      const { data: saldos } = await supabase
        .from('estados_financieros')
        .select('caja_bancos, stock_inventario, cuentas_por_cobrar, deuda_proveedores_inicial, activos_no_corrientes')
        .match({ cliente_id: resCliente.data.id, periodo: fechaInicio })
        .single();

      if (saldos) {
        setFormSaldos({
            caja_bancos: saldos.caja_bancos?.toString() || '',
            stock_inventario: saldos.stock_inventario?.toString() || '',
            cuentas_por_cobrar: saldos.cuentas_por_cobrar?.toString() || '',
            deuda_proveedores_inicial: saldos.deuda_proveedores_inicial?.toString() || '',
            activos_no_corrientes: saldos.activos_no_corrientes?.toString() || ''
        });
      } else {
        setFormSaldos({ caja_bancos: '', stock_inventario: '', cuentas_por_cobrar: '', deuda_proveedores_inicial: '', activos_no_corrientes: '' });
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token, mesFiltro]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const guardarMovimiento = async () => {
    if (!form.monto || !form.categoria) return toast.warning("Falta monto o categoría");
    setGuardando(true);
    try {
      const nuevoMov = {
        cliente_id: cliente.id,
        fecha: form.fecha,
        tipo: tipoMovimiento,
        categoria: form.categoria,
        monto: parseFloat(form.monto),
        descripcion: form.descripcion || (tipoMovimiento === 'ingreso' ? 'Venta del día' : 'Gasto operativo')
      };
      const { data, error } = await supabase.from('movimientos').insert([nuevoMov]).select().single();
      if (error) throw error;

      toast.success("Guardado correctamente");
      if (form.fecha.startsWith(mesFiltro)) setMovimientos(prev => [data, ...prev]);
      else toast.info(`Guardado en historial de ${form.fecha}.`);
      
      setForm(prev => ({ ...prev, monto: '', descripcion: '' })); 
    } catch (e) {
      toast.error("Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const guardarSaldos = async () => {
    setGuardando(true);
    try {
      const periodoDate = `${mesFiltro}-01`;
      const payload = {
        cliente_id: cliente.id,
        periodo: periodoDate,
        caja_bancos: parseFloat(formSaldos.caja_bancos) || 0,
        stock_inventario: parseFloat(formSaldos.stock_inventario) || 0,
        cuentas_por_cobrar: parseFloat(formSaldos.cuentas_por_cobrar) || 0,
        deuda_proveedores_inicial: parseFloat(formSaldos.deuda_proveedores_inicial) || 0,
        activos_no_corrientes: parseFloat(formSaldos.activos_no_corrientes) || 0
      };
      
      const { error } = await supabase
        .from('estados_financieros')
        .upsert(payload, { onConflict: 'cliente_id, periodo', ignoreDuplicates: false }); 

      if (error) throw error;
      toast.success("Saldos informados correctamente");
    } catch (e) {
        console.error(e);
        toast.error("Error al informar saldos");
    } finally {
        setGuardando(false);
    }
  };

  const borrarMovimiento = async (movId: string) => {
    if(!confirm("¿Borrar este movimiento?")) return;
    if (!cliente?.id) return toast.error("Sesión inválida");
    const { error } = await supabase
      .from('movimientos')
      .delete()
      .eq('id', movId)
      .eq('cliente_id', cliente.id);
    if (error) return toast.error("No autorizado");
    setMovimientos(movimientos.filter(m => m.id !== movId));
    toast.success("Eliminado");
  };

  const resumen = useMemo(() => {
    return movimientos.reduce((acc, curr) => {
      if (curr.tipo === 'ingreso') return { ...acc, ingresos: acc.ingresos + curr.monto };
      return { ...acc, egresos: acc.egresos + curr.monto };
    }, { ingresos: 0, egresos: 0 });
  }, [movimientos]);

  if (loading && !cliente) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  if (!cliente && !loading) return <div className="h-screen flex items-center justify-center text-white bg-slate-950 flex-col gap-4"><LogOut size={40} className="text-red-500"/><p>Enlace no válido o expirado.</p></div>;

  return (
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties}
      className="min-h-screen bg-slate-950 p-4 pb-40 font-sans selection:bg-primary/30 relative"
    >
      <div className="max-w-md mx-auto space-y-6">
        
        {/* HEADER APP */}
        <div className="flex items-center justify-between text-white py-2">
          <div className="flex items-center gap-2">
            <div className="bg-white text-slate-900 p-1.5 rounded-lg"><Mountain size={18} /></div>
            <span className="font-bold tracking-wide text-sm">RIVA APP</span>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => cargarDatos()} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                <RefreshCw size={16} className={loading ? "animate-spin text-primary" : "text-slate-400"}/>
             </button>
             <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Cliente</p>
                <p className="text-sm font-bold leading-none text-primary">{cliente?.razon_social}</p>
             </div>
          </div>
        </div>

        {/* SELECTOR MES */}
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 focus-within:border-primary/50 transition-colors">
            <Calendar size={18} className="text-slate-400 ml-2" />
            <input type="month" value={mesFiltro} onChange={(e) => { setMesFiltro(e.target.value); setForm(prev => ({ ...prev, fecha: `${e.target.value}-01` })); }} className="bg-transparent text-white font-bold outline-none text-sm w-full cursor-pointer" />
        </div>

        {/* TARJETA RESUMEN */}
        {tipoMovimiento !== 'saldos' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Flujo del Mes (Neto)</p>
            <h2 className="text-4xl font-black text-white mb-4">$ {(resumen.ingresos - resumen.egresos).toLocaleString('es-AR')}</h2>
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg"><TrendingUp size={14} /> + $ {resumen.ingresos.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded-lg"><TrendingDown size={14} /> - $ {resumen.egresos.toLocaleString()}</div>
            </div>
            </div>
        )}

        {/* SWITCHER TABS */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
           <button onClick={() => { setTipoMovimiento('ingreso'); setForm({...form, categoria: 'ventas_totales'}); }} className={`py-3 rounded-xl font-bold text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${tipoMovimiento === 'ingreso' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}><TrendingUp size={16} /> INGRESO</button>
           <button onClick={() => { setTipoMovimiento('egreso'); setForm({...form, categoria: 'costo_ventas'}); }} className={`py-3 rounded-xl font-bold text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${tipoMovimiento === 'egreso' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white'}`}><TrendingDown size={16} /> GASTO</button>
           <button onClick={() => setTipoMovimiento('saldos')} className={`py-3 rounded-xl font-bold text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${tipoMovimiento === 'saldos' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}><Wallet size={16} /> SALDOS</button>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
           {tipoMovimiento === 'saldos' ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-4">
                    <p className="text-blue-300 text-xs flex gap-2"><AlertCircle size={16}/> Informá los saldos reales de fin de mes.</p>
                </div>
                
                {/* CAMPO DEUDA PROVEEDORES */}
                <div>
                    <label className="text-[10px] text-red-400 font-bold uppercase mb-1 block flex items-center gap-1"><Landmark size={12}/> Deuda Proveedores (Inicial)</label>
                    <input type="number" placeholder="Total que debías al iniciar..." value={formSaldos.deuda_proveedores_inicial} onChange={e => setFormSaldos({...formSaldos, deuda_proveedores_inicial: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-1 focus:ring-red-500 border border-red-500/20" />
                </div>

                <div className="border-t border-slate-800 my-2 pt-2"></div>

                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Saldo en Caja / Bancos</label>
                    <input type="number" placeholder="0.00" value={formSaldos.caja_bancos} onChange={e => setFormSaldos({...formSaldos, caja_bancos: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Valor Stock / Inventario</label>
                    <input type="number" placeholder="0.00" value={formSaldos.stock_inventario} onChange={e => setFormSaldos({...formSaldos, stock_inventario: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-1 focus:ring-blue-500" />
                </div>
                
                {/* CAMPO ACTIVOS NO CORRIENTES */}
                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block flex items-center gap-1"><Monitor size={12}/> Bienes de Uso / Equipamiento</label>
                    <input type="number" placeholder="Total valor máquinas, autos..." value={formSaldos.activos_no_corrientes} onChange={e => setFormSaldos({...formSaldos, activos_no_corrientes: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-1 focus:ring-blue-500" />
                </div>

                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Cuentas por Cobrar (Fiado)</label>
                    <input type="number" placeholder="0.00" value={formSaldos.cuentas_por_cobrar} onChange={e => setFormSaldos({...formSaldos, cuentas_por_cobrar: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-1 focus:ring-blue-500" />
                </div>
                <button onClick={guardarSaldos} disabled={guardando} className="w-full py-4 rounded-xl font-black text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 bg-blue-500 shadow-blue-500/20 hover:bg-blue-600">
                    {guardando ? <Loader2 className="animate-spin" /> : <Save size={20} strokeWidth={3} />} ACTUALIZAR SALDOS
                </button>
             </div>
           ) : (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Fecha</label>
                        <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Monto</label>
                        <input type="number" placeholder="0.00" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Categoría</label>
                    <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm appearance-none focus:ring-2 focus:ring-primary/50 transition-all">
                        {CATEGORIAS[tipoMovimiento].map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Descripción</label>
                    <input type="text" placeholder="Opcional..." value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <button onClick={guardarMovimiento} disabled={guardando} className={`w-full py-4 rounded-xl font-black text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${tipoMovimiento === 'ingreso' ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-red-500 shadow-red-500/20 hover:bg-red-600'}`}>
                    {guardando ? <Loader2 className="animate-spin" /> : <Plus size={20} strokeWidth={3} />} CARGAR {tipoMovimiento === 'ingreso' ? 'VENTA' : 'GASTO'}
                </button>
             </div>
           )}
        </div>

        {tipoMovimiento !== 'saldos' && (
            <div>
            <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4 ml-2">Últimos Movimientos</h3>
            <div className="space-y-3">
                {movimientos.map((m) => {
                const catLabel = CATEGORIAS.ingreso.concat(CATEGORIAS.egreso).find(c => c.id === m.categoria)?.label || m.categoria;
                return (
                    <div key={m.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-transform">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${m.tipo === 'ingreso' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {m.tipo === 'ingreso' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm line-clamp-1">{catLabel}</p>
                                <p className="text-slate-500 text-[10px] uppercase font-bold">{new Date(m.fecha).toLocaleDateString('es-AR', {day: '2-digit', month: 'short', timeZone: 'UTC'})} • {m.descripcion || 'Sin nota'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`font-mono font-bold ${m.tipo === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {m.tipo === 'ingreso' ? '+' : '-'} ${m.monto.toLocaleString()}
                            </span>
                            <button onClick={() => borrarMovimiento(m.id)} className="text-slate-600 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                        </div>
                    </div>
                );
                })}
                {movimientos.length === 0 && <p className="text-center text-slate-600 italic text-sm py-4">No hay movimientos en este periodo.</p>}
            </div>
            </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. COMPONENTE PRINCIPAL (Wrapper)
// ------------------------------------------------------------------
export default function CargaDiariaPage() {
  return (
    <Suspense fallback={
        <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
            <Loader2 className="animate-spin text-slate-500" size={40} />
        </div>
    }>
        <ContenidoCargaDiaria />
    </Suspense>
  );
}