"use client";

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Briefcase, Save, ArrowLeft, 
  Loader2, Calendar, User, Share2, 
  Check, RefreshCw, Calculator,
  Zap, Droplets, Flame, Wifi, Smartphone,
  Trash2, PiggyBank, ArrowUpCircle, ArrowDownCircle, Truck, Scale,
  Building2, Landmark as Bank, Minus, Equal, Users
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { roundMoney } from '@/lib/utils';

export default function ContabilidadPage() {
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); 
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [movimientosCount, setMovimientosCount] = useState(0);

  const [clienteId, setClienteId] = useState('');
  const [periodo, setPeriodo] = useState(new Date().toISOString().slice(0, 7));
  
  // --- ESTRUCTURA DE DATOS DETALLADA ---
  const [data, setData] = useState<any>({
    // 1. Ingresos
    ventas_totales: 0, 
    prestamos_recibidos: 0, 
    aporte_socios: 0, 
    otros_ingresos: 0,

    // 2. Costos Directos
    costo_ventas: 0,
    fletes_logistica: 0,
    combustible_viaticos: 0,
    
    // 3. Mantenimiento y Bienes
    reparaciones: 0,
    compra_equipamiento: 0,
    seguros: 0,

    // 4. Financieros
    pago_prestamos: 0,
    cuotas_planes: 0,
    gastos_bancarios: 0,
    impuesto_debito_credito: 0,
    comisiones_tarjetas: 0,

    // 5. Impuestos
    retenciones_iibb: 0,
    retenciones_iva: 0,
    retenciones_ganancias: 0,
    iva_pagado: 0,
    ingresos_brutos: 0,
    tasas_municipales: 0,
    
    // 6. Estructura y RRHH
    cargas_sociales: 0,
    monotributo_autonomos: 0,
    alquileres: 0,
    sueldos: 0,
    
    // 7. Servicios
    luz: 0, gas: 0, agua: 0,
    internet: 0, telefonia: 0,

    // 8. Oficina y Varios
    libreria_insumos: 0,
    marketing_publicidad: 0,
    honorarios_profesionales: 0,
    deudas_proveedores: 0,
    retiros_socios: 0,
    otros_gastos: 0,

    // --- PATRIMONIALES ---
    caja_bancos: 0, 
    stock_inventario: 0, 
    cuentas_por_cobrar: 0,
    activos_no_corrientes: 0, 
    pasivos_no_corrientes: 0,
    
    // --- CÁLCULO DEUDA ---
    deuda_proveedores_inicial: 0,
    deuda_proveedores_saldo: 0
  });

  // Helper para convertir color de forma segura
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

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const [resClientes, resConfig] = await Promise.all([
          supabase.from('clientes').select('id, razon_social, token_acceso').order('razon_social'),
          supabase.from('configuracion').select('color_primario').single()
        ]);
        setClientes(resClientes.data || []);
        
        // APLICAMOS COLOR DEL ADMIN
        if (resConfig.data?.color_primario) {
           setAccentColor(hexToRgb(resConfig.data.color_primario));
        }
      } catch (e) {
        toast.error("Error al conectar con la base de datos");
      } finally {
        setLoading(false);
      }
    };
    cargarConfig();
  }, []);

  // Recálculo automático de deuda proveedores
  useEffect(() => {
    const inicial = data.deuda_proveedores_inicial || 0;
    const pagos = data.deudas_proveedores || 0; 
    const saldo = Math.max(0, inicial - pagos);
    
    if (saldo !== data.deuda_proveedores_saldo) {
        setData((prev: any) => ({ ...prev, deuda_proveedores_saldo: saldo }));
    }
  }, [data.deuda_proveedores_inicial, data.deudas_proveedores]);

  const procesarMovimientosDelMes = async () => {
    if (!clienteId || !periodo) return;
    setFetching(true);
    setMovimientosCount(0);

    try {
      const [anioStr, mesStr] = periodo.split('-'); 
      const fechaInicio = `${periodo}-01`;
      const ultimoDia = new Date(parseInt(anioStr), parseInt(mesStr), 0).getDate();
      const fechaFin = `${periodo}-${ultimoDia}`; 

      // 1. CARGAMOS MOVIMIENTOS
      const { data: movimientos } = await supabase
        .from('movimientos')
        .select('*')
        .eq('cliente_id', clienteId)
        .gte('fecha', fechaInicio)
        .lte('fecha', fechaFin);

      // 2. CARGAMOS SALDOS GUARDADOS
      const { data: estadoGuardado } = await supabase
        .from('estados_financieros')
        .select('*')
        .match({ cliente_id: clienteId, periodo: fechaInicio })
        .single();

      // Reiniciamos contadores de flujo a 0
      const nuevoEstado: any = { ...data };
      const camposFlujo = [
        'ventas_totales', 'prestamos_recibidos', 'otros_ingresos', 
        'costo_ventas', 'fletes_logistica', 'combustible_viaticos',
        'reparaciones', 'compra_equipamiento', 'seguros',
        'pago_prestamos', 'cuotas_planes', 'gastos_bancarios', 'impuesto_debito_credito', 'comisiones_tarjetas',
        'retenciones_iibb', 'retenciones_iva', 'retenciones_ganancias', 'iva_pagado', 'ingresos_brutos', 'tasas_municipales', 'monotributo_autonomos',
        'alquileres', 'sueldos', 'cargas_sociales',
        'luz', 'gas', 'agua', 'internet', 'telefonia',
        'libreria_insumos', 'marketing_publicidad', 'honorarios_profesionales', 'deudas_proveedores', 'retiros_socios', 'otros_gastos',
        'aporte_socios'
      ];
      camposFlujo.forEach(k => nuevoEstado[k] = 0);

      if (estadoGuardado) {
         nuevoEstado.caja_bancos = estadoGuardado.caja_bancos || 0;
         nuevoEstado.stock_inventario = estadoGuardado.stock_inventario || 0;
         nuevoEstado.cuentas_por_cobrar = estadoGuardado.cuentas_por_cobrar || 0;
         nuevoEstado.pasivos_no_corrientes = estadoGuardado.pasivos_no_corrientes || 0;
         nuevoEstado.deuda_proveedores_inicial = estadoGuardado.deuda_proveedores_inicial || 0;
         nuevoEstado.activos_no_corrientes = estadoGuardado.activos_no_corrientes || 0;
         if (!movimientos || movimientos.length === 0) {
            nuevoEstado.otros_ingresos = estadoGuardado.otros_ingresos || 0;
         }
      }

      if (movimientos && movimientos.length > 0) {
        setMovimientosCount(movimientos.length);
        movimientos.forEach(m => {
           const valor = roundMoney(m.monto);
           const cat = m.categoria;
           if (nuevoEstado.hasOwnProperty(cat)) {
             nuevoEstado[cat] = roundMoney(nuevoEstado[cat] + valor);
           } 
           else if (cat === 'prestamos_bancarios') nuevoEstado.prestamos_recibidos = roundMoney(nuevoEstado.prestamos_recibidos + valor);
           else if (cat === 'otros') nuevoEstado.otros_gastos = roundMoney(nuevoEstado.otros_gastos + valor);
        });
      }

      setData(nuevoEstado);
      
      // ✅ CORRECCIÓN DEL ERROR DE TYPESCRIPT AQUÍ
      if (movimientos && movimientos.length > 0) {
        toast.success(`Sincronizados ${movimientos.length} registros.`);
      } else {
        toast.info("Mes sin movimientos aun.");
      }

    } catch (e: any) {
      toast.error("Error al procesar");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (clienteId && periodo) procesarMovimientosDelMes();
  }, [clienteId, periodo]);

  const copiarLinkCliente = () => {
    if (!clienteId) return toast.warning("Seleccioná un cliente primero");
    const cliente = clientes.find(c => c.id.toString() === clienteId);
    if (!cliente?.token_acceso) return toast.error("Sin token configurado");
    const url = `${window.location.origin}/carga-diaria/${cliente.token_acceso}`;
    navigator.clipboard.writeText(url);
    setLinkCopiado(true);
    toast.success("Link copiado");
    setTimeout(() => setLinkCopiado(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const eliminarCierre = async () => {
    if (!clienteId) return toast.warning("Seleccioná un cliente");
    if (!confirm("⚠️ PELIGRO: Se borrarán todos los datos de este mes.")) return;

    setDeleting(true);
    try {
      const fechaInicio = `${periodo}-01`;
      const [anioStr, mesStr] = periodo.split('-');
      const ultimoDia = new Date(parseInt(anioStr), parseInt(mesStr), 0).getDate();
      const fechaFin = `${periodo}-${ultimoDia}`;

      await supabase.from('movimientos').delete().eq('cliente_id', clienteId).gte('fecha', fechaInicio).lte('fecha', fechaFin);
      await supabase.from('estados_financieros').delete().match({ cliente_id: clienteId, periodo: fechaInicio });

      toast.success("Mes reiniciado.");
      const ceros: any = {};
      Object.keys(data).forEach(k => ceros[k] = 0);
      setData(ceros);
      setMovimientosCount(0);
    } catch (e: any) {
      toast.error("Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  const guardarEstado = async () => {
    if (!clienteId) return toast.warning("Seleccioná un cliente");
    setSaving(true);
    try {
      const n = (val: any) => roundMoney(val);

      const impuestosTotal = n(data.retenciones_iibb + data.retenciones_iva + data.retenciones_ganancias + data.iva_pagado + data.ingresos_brutos + data.tasas_municipales + data.monotributo_autonomos);
      const gastosBancariosTotal = n(data.gastos_bancarios + data.impuesto_debito_credito + data.comisiones_tarjetas + data.cuotas_planes + data.pago_prestamos);
      const mantenimientoTotal = n(data.reparaciones + data.seguros + data.libreria_insumos + data.honorarios_profesionales + data.otros_gastos);
      const costoVentasTotal = n(data.costo_ventas + data.fletes_logistica + data.combustible_viaticos);
      const luzAguaGas = n(data.luz + data.gas + data.agua);
      const internetTel = n(data.internet + data.telefonia);
      const rrhh = n(data.sueldos + data.cargas_sociales);

      const payload = {
        cliente_id: clienteId,
        periodo: `${periodo}-01`,
        ventas_totales: n(data.ventas_totales),
        otros_ingresos: n(data.otros_ingresos),
        costo_ventas: costoVentasTotal,
        impuestos: impuestosTotal,
        alquileres: n(data.alquileres),
        luz_agua_gas: luzAguaGas,
        internet_telefonia: internetTel,
        sueldos_cargas_sociales: rrhh,
        marketing_publicidad: n(data.marketing_publicidad),
        gastos_bancarios_comisiones: gastosBancariosTotal,
        mantenimiento_limpieza: mantenimientoTotal,
        aporte_socios: n(data.aporte_socios),
        retiros_socios: n(data.retiros_socios),
        caja_bancos: n(data.caja_bancos),
        stock_inventario: n(data.stock_inventario),
        cuentas_por_cobrar: n(data.cuentas_por_cobrar),
        activos_no_corrientes: n(data.activos_no_corrientes), 
        deudas_proveedores: n(data.deuda_proveedores_saldo), 
        deuda_proveedores_inicial: n(data.deuda_proveedores_inicial), 
        prestamos_bancarios: n(data.prestamos_recibidos), 
        pasivos_no_corrientes: n(data.pasivos_no_corrientes),
        gastos_operativos: n(n(data.alquileres) + luzAguaGas + rrhh + internetTel + n(data.marketing_publicidad) + mantenimientoTotal + gastosBancariosTotal),
        patrimonio_neto: n((n(data.caja_bancos) + n(data.stock_inventario) + n(data.cuentas_por_cobrar) + n(data.activos_no_corrientes)) - (n(data.deuda_proveedores_saldo) + n(data.prestamos_recibidos) + n(data.pasivos_no_corrientes)))
      };

      const { error } = await supabase.from('estados_financieros').upsert([payload], { onConflict: 'cliente_id, periodo' });
      if (error) throw error;
      toast.success("Cierre guardado correctamente.");
    } catch (e: any) {
      toast.error("Error al guardar: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const totalEgresos = roundMoney(data.costo_ventas + data.fletes_logistica + data.combustible_viaticos + data.alquileres + data.luz + data.gas + data.agua + data.sueldos + data.cargas_sociales + data.retenciones_iibb + data.retenciones_iva + data.retenciones_ganancias + data.iva_pagado + data.ingresos_brutos + data.tasas_municipales + data.monotributo_autonomos + data.internet + data.telefonia + data.marketing_publicidad + data.libreria_insumos + data.honorarios_profesionales + data.reparaciones + data.seguros + data.otros_gastos + data.gastos_bancarios + data.impuesto_debito_credito + data.comisiones_tarjetas + data.cuotas_planes);
  const utilidadNeta = roundMoney((data.ventas_totales + data.otros_ingresos) - totalEgresos);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    // SE APLICA EL COLOR DINÁMICO
    <div style={{ '--primary': accentColor } as React.CSSProperties} className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm"><ArrowLeft size={22} /></Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Cierre Mensual</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Sincronización Detallada.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* BOTONES DE ACCIÓN */}
          <button onClick={procesarMovimientosDelMes} disabled={fetching} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary/50 transition-all shadow-sm" title="Sincronizar Datos Ahora">
            <RefreshCw size={20} className={fetching ? "animate-spin" : ""} />
          </button>
          <button onClick={eliminarCierre} disabled={deleting} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm" title="Borrar mes">
            {deleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
          </button>
          <button onClick={copiarLinkCliente} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl font-bold transition-all hover:shadow-md">
            {linkCopiado ? <Check size={20} className="text-emerald-500" /> : <Share2 size={20} className="text-primary" />}
            Link App
          </button>
          <button onClick={guardarEstado} disabled={saving} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20">
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Validar Cierre
          </button>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto space-y-8 ${fetching ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><User size={12} className="text-primary" /> Empresa</label>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold text-slate-700 dark:text-white outline-none">
              <option value="">Seleccionar Empresa...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Calendar size={12} className="text-primary" /> Período</label>
            <input type="month" value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-bold text-slate-700 dark:text-white outline-none" />
          </div>
        </div>

        {movimientosCount > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
            <Calculator size={16} className="text-emerald-500" />
            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-bold">Se cargaron {movimientosCount} movimientos automáticos.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA 1: INGRESOS & COSTOS */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 text-lg border-b dark:border-slate-800 pb-4"><TrendingUp size={20} className="text-emerald-500" /> Operativo</h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {/* INGRESOS */}
              <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-3">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Ingresos</p>
                <div><label className="lbl">Ventas Totales</label><input type="number" name="ventas_totales" value={data.ventas_totales} onChange={handleInputChange} className="input-field text-emerald-600 font-bold" /></div>
                <div><label className="lbl">Otros Ingresos</label><input type="number" name="otros_ingresos" value={data.otros_ingresos} onChange={handleInputChange} className="input-field" /></div>
              </div>

              {/* COSTOS DIRECTOS */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3 border border-slate-100 dark:border-slate-800">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Truck size={10}/> Costos Directos</p>
                <div><label className="lbl">Compra Mercadería</label><input type="number" name="costo_ventas" value={data.costo_ventas} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="lbl">Fletes y Logística</label><input type="number" name="fletes_logistica" value={data.fletes_logistica} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="lbl">Combustible / Viáticos</label><input type="number" name="combustible_viaticos" value={data.combustible_viaticos} onChange={handleInputChange} className="input-field" /></div>
              </div>

              {/* IMPUESTOS */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3 border border-slate-100 dark:border-slate-800">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Scale size={10}/> Impuestos</p>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className="lbl">IIBB</label><input type="number" name="ingresos_brutos" value={data.ingresos_brutos} onChange={handleInputChange} className="input-field" /></div>
                    <div><label className="lbl">IVA Pago</label><input type="number" name="iva_pagado" value={data.iva_pagado} onChange={handleInputChange} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div><label className="lbl">Ret. IIBB</label><input type="number" name="retenciones_iibb" value={data.retenciones_iibb} onChange={handleInputChange} className="input-field px-1" /></div>
                    <div><label className="lbl">Ret. IVA</label><input type="number" name="retenciones_iva" value={data.retenciones_iva} onChange={handleInputChange} className="input-field px-1" /></div>
                    <div><label className="lbl">Ret. Gan.</label><input type="number" name="retenciones_ganancias" value={data.retenciones_ganancias} onChange={handleInputChange} className="input-field px-1" /></div>
                </div>
                <div><label className="lbl">Tasas Municipales</label><input type="number" name="tasas_municipales" value={data.tasas_municipales} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="lbl">Monotributo / Aut.</label><input type="number" name="monotributo_autonomos" value={data.monotributo_autonomos} onChange={handleInputChange} className="input-field" /></div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: ESTRUCTURA Y FINANCIERO */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 text-lg border-b dark:border-slate-800 pb-4"><Building2 size={20} className="text-blue-500" /> Estructura</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="grid grid-cols-2 gap-3">
                <div><label className="lbl">Alquileres</label><input type="number" name="alquileres" value={data.alquileres} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="lbl">Expensas/Otros</label><input type="number" name="otros_gastos" value={data.otros_gastos} onChange={handleInputChange} className="input-field" /></div>
              </div>

              {/* SERVICIOS DETALLADOS */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Servicios</p>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="lbl flex gap-1"><Zap size={8}/> Luz</label><input type="number" name="luz" value={data.luz} onChange={handleInputChange} className="input-field" /></div>
                  <div><label className="lbl flex gap-1"><Flame size={8}/> Gas</label><input type="number" name="gas" value={data.gas} onChange={handleInputChange} className="input-field" /></div>
                  <div><label className="lbl flex gap-1"><Droplets size={8}/> Agua</label><input type="number" name="agua" value={data.agua} onChange={handleInputChange} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="lbl flex gap-1"><Wifi size={8}/> Internet</label><input type="number" name="internet" value={data.internet} onChange={handleInputChange} className="input-field" /></div>
                  <div><label className="lbl flex gap-1"><Smartphone size={8}/> Tel</label><input type="number" name="telefonia" value={data.telefonia} onChange={handleInputChange} className="input-field" /></div>
                </div>
              </div>

              {/* RRHH */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Users size={10}/> RRHH</p>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className="lbl">Sueldos</label><input type="number" name="sueldos" value={data.sueldos} onChange={handleInputChange} className="input-field" /></div>
                    <div><label className="lbl">Cargas Soc.</label><input type="number" name="cargas_sociales" value={data.cargas_sociales} onChange={handleInputChange} className="input-field" /></div>
                </div>
              </div>

              {/* FINANCIERO */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Bank size={10}/> Financiero</p>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className="lbl">Bancarios</label><input type="number" name="gastos_bancarios" value={data.gastos_bancarios} onChange={handleInputChange} className="input-field" /></div>
                    <div><label className="lbl">Imp. Cheque</label><input type="number" name="impuesto_debito_credito" value={data.impuesto_debito_credito} onChange={handleInputChange} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className="lbl">Comis. Tarj.</label><input type="number" name="comisiones_tarjetas" value={data.comisiones_tarjetas} onChange={handleInputChange} className="input-field" /></div>
                    <div><label className="lbl">Cuotas/Int.</label><input type="number" name="cuotas_planes" value={data.cuotas_planes} onChange={handleInputChange} className="input-field" /></div>
                </div>
                <div><label className="lbl">Pago Capital Préstamos</label><input type="number" name="pago_prestamos" value={data.pago_prestamos} onChange={handleInputChange} className="input-field" /></div>
              </div>

              <div><label className="lbl">Marketing / Publicidad</label><input type="number" name="marketing_publicidad" value={data.marketing_publicidad} onChange={handleInputChange} className="input-field" /></div>
              <div><label className="lbl">Honorarios Profesionales</label><input type="number" name="honorarios_profesionales" value={data.honorarios_profesionales} onChange={handleInputChange} className="input-field" /></div>
              <div><label className="lbl">Librería / Insumos</label><input type="number" name="libreria_insumos" value={data.libreria_insumos} onChange={handleInputChange} className="input-field" /></div>
              
              <div className="grid grid-cols-2 gap-2">
                <div><label className="lbl">Reparaciones</label><input type="number" name="reparaciones" value={data.reparaciones} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="lbl">Seguros</label><input type="number" name="seguros" value={data.seguros} onChange={handleInputChange} className="input-field" /></div>
              </div>
            </div>
          </div>

          {/* COLUMNA 3: PATRIMONIAL + SOCIOS */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 text-lg border-b dark:border-slate-800 pb-4"><Briefcase size={20} className="text-primary" /> Patrimonial</h3>
            <div className="space-y-4">
              
              {/* MOVIMIENTOS SOCIOS */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 border border-slate-100 dark:border-slate-700">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><PiggyBank size={12}/> Movimientos Socios</p>
                <div>
                    <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 block flex items-center gap-1"><ArrowUpCircle size={10}/> Aporte Capital</label>
                    <input type="number" name="aporte_socios" value={data.aporte_socios} onChange={handleInputChange} className="input-field" />
                </div>
                <div>
                    <label className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 block flex items-center gap-1"><ArrowDownCircle size={10}/> Retiro Socios</label>
                    <input type="number" name="retiros_socios" value={data.retiros_socios} onChange={handleInputChange} className="input-field" />
                </div>
              </div>

              <div><label className="lbl">Caja y Bancos (Saldo)</label><input type="number" name="caja_bancos" value={data.caja_bancos} onChange={handleInputChange} className="input-field" /></div>
              <div><label className="lbl">Stock / Inventario</label><input type="number" name="stock_inventario" value={data.stock_inventario} onChange={handleInputChange} className="input-field" /></div>
              <div><label className="lbl">Cuentas x Cobrar</label><input type="number" name="cuentas_por_cobrar" value={data.cuentas_por_cobrar} onChange={handleInputChange} className="input-field" /></div>
              
              {/* CALCULADORA DEUDA PROVEEDORES */}
              <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-3">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">Proveedores</p>
                <div>
                    <label className="lbl">Deuda Inicial (Manual)</label>
                    <input type="number" name="deuda_proveedores_inicial" value={data.deuda_proveedores_inicial} onChange={handleInputChange} className="input-field bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300" placeholder="0" />
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <Minus size={12}/>
                    <div className="flex-1">
                        <label className="lbl">Pagos del Mes (Flujo)</label>
                        <div className="px-3 py-2 font-mono text-sm font-bold text-slate-500">{data.deudas_proveedores}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-900 dark:text-white pt-2 border-t border-red-200 dark:border-red-800/30">
                    <Equal size={12}/>
                    <div className="flex-1">
                        <label className="lbl text-red-600">Saldo Final (Calculado)</label>
                        <input type="number" name="deuda_proveedores_saldo" value={data.deuda_proveedores_saldo} onChange={handleInputChange} className="input-field font-black" />
                    </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div><label className="lbl">Préstamos Recibidos</label><input type="number" name="prestamos_recibidos" value={data.prestamos_recibidos} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="lbl">Equipamiento (Alta)</label><input type="number" name="compra_equipamiento" value={data.compra_equipamiento} onChange={handleInputChange} className="input-field" /></div>
              </div>
              <div><label className="lbl">Activos No Ctes (Saldo)</label><input type="number" name="activos_no_corrientes" value={data.activos_no_corrientes} onChange={handleInputChange} className="input-field" /></div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Resultado Operativo</p>
            <h4 className="text-3xl font-black text-emerald-700 font-mono">$ {utilidadNeta.toLocaleString('es-AR')}</h4>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lbl {
          display: block;
          font-size: 9px;
          font-weight: 900;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .input-field {
          width: 100%;
          padding: 8px 12px;
          background-color: white;
          border-radius: 10px;
          font-family: monospace;
          font-weight: bold;
          font-size: 13px;
          outline: none;
          border: none;
        }
        .dark .input-field {
          background-color: #1e293b;
          color: white;
        }
      `}</style>
    </div>
  );
}