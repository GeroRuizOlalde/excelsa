"use client";

import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Loader2, User, ChevronDown, 
  FileText, Calendar, DollarSign, Percent, PieChart as PieIcon, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Importamos librerías para PDF Nativo
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReporteMensualPage() {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState('');
  
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear().toString());
  const [mesSeleccionado, setMesSeleccionado] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  
  const [razonSocialSelect, setRazonSocialSelect] = useState('');
  const [datosMes, setDatosMes] = useState<any>(null);
  const [accentColor, setAccentColor] = useState('59, 130, 246'); 

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
    return '59, 130, 246';
  }

  useEffect(() => {
    const init = async () => {
      try {
        const [resClientes, resConfig] = await Promise.all([
          supabase.from('clientes').select('id, razon_social').order('razon_social'),
          supabase.from('configuracion').select('color_primario').eq('id', 1).single()
        ]);
        setClientes(resClientes.data || []);
        
        if (resConfig.data?.color_primario) {
            setAccentColor(hexToRgb(resConfig.data.color_primario));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchMes = async (id: string, anio: string, mes: string) => {
    if (!id) return;
    setLoading(true);
    const nombre = clientes.find(c => c.id === id)?.razon_social || 'Cliente';
    setRazonSocialSelect(nombre);

    try {
      const periodoExacto = `${anio}-${mes}-01`;

      const { data, error } = await supabase
        .from('estados_financieros')
        .select('*')
        .eq('cliente_id', id)
        .eq('periodo', periodoExacto)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        setDatosMes(null);
        setLoading(false);
        return;
      }

      const ingresos = data.ventas_totales || 0;
      const costoDirecto = data.costo_ventas || 0;
      const estructura = (data.alquileres || 0) + (data.luz_agua_gas || 0) + (data.internet_telefonia || 0) + (data.sueldos_cargas_sociales || 0) + (data.mantenimiento_limpieza || 0);
      const impuestos = data.impuestos || 0;
      const financieroComercial = (data.gastos_bancarios_comisiones || 0) + (data.marketing_publicidad || 0);

      const gastosTotales = costoDirecto + estructura + impuestos + financieroComercial;
      const utilidad = ingresos - gastosTotales;
      const margen = ingresos > 0 ? ((utilidad / ingresos) * 100).toFixed(1) : 0;

      setDatosMes({
        ingresos,
        gastosTotales,
        utilidad,
        margen,
        desgloseGastos: [
          { name: 'Costo Directo (Mercadería)', value: costoDirecto, color: '#f59e0b' },
          { name: 'Estructura (Alq, Servicios, RRHH)', value: estructura, color: '#3b82f6' },
          { name: 'Impuestos Consolidados', value: impuestos, color: '#ef4444' },
          { name: 'Financiero & Comercial', value: financieroComercial, color: '#8b5cf6' }
        ].filter(g => g.value > 0)
      });

    } catch (e) {
      console.error(e);
      toast.error("Error al cargar el mes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if(clienteId) fetchMes(clienteId, anioSeleccionado, mesSeleccionado); 
  }, [clienteId, anioSeleccionado, mesSeleccionado]);

  // NUEVA FUNCIÓN PDF NATIVO
  const generarPDFNativo = () => {
    if (!datosMes) return toast.error("No hay datos para exportar");
    
    const doc = new jsPDF();
    const colorPrimario: [number, number, number] = [59, 130, 246]; // Azul Excelsa
    const nombreMes = meses.find(m => m.val === mesSeleccionado)?.label || '';

    // --- ENCABEZADO ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("EXCELSA", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Consultoría Empresarial", 14, 26);

    // --- DATOS DEL CLIENTE ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(razonSocialSelect, 196, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Reporte Económico Consolidado • ${nombreMes} ${anioSeleccionado}`, 196, 26, { align: "right" });

    // Línea divisoria
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // --- RESUMEN DE KPIs ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Resumen Operativo", 14, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(`Ingresos Netos: $ ${datosMes.ingresos.toLocaleString('es-AR')}`, 14, 53);
    doc.text(`Egresos Totales: $ ${datosMes.gastosTotales.toLocaleString('es-AR')}`, 14, 59);

    const esPositivo = datosMes.utilidad >= 0;
    doc.setFont("helvetica", "bold");
    if (esPositivo) {
        doc.setTextColor(16, 185, 129); // emerald-500
    } else {
        doc.setTextColor(239, 68, 68); // red-500
    }
    doc.text(`Utilidad Mensual: $ ${datosMes.utilidad.toLocaleString('es-AR')} (Margen: ${datosMes.margen}%)`, 14, 65);

    // --- TABLA DE DESGLOSE DE GASTOS ---
    const tableData = datosMes.desgloseGastos.map((g: any) => [
      g.name,
      `$ ${g.value.toLocaleString('es-AR')}`,
      `${datosMes.gastosTotales > 0 ? ((g.value / datosMes.gastosTotales) * 100).toFixed(1) : 0}%`
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Concepto de Egreso', 'Monto', 'Participación']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: colorPrimario, textColor: 255, fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, textColor: [71, 85, 105] },
      alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
    });

    // --- SECCIÓN DE FIRMAS ---
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    
    doc.setDrawColor(15, 23, 42);
    doc.line(30, finalY + 40, 80, finalY + 40); // Línea firma 1
    doc.line(130, finalY + 40, 180, finalY + 40); // Línea firma 2

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Aprobación Cliente", 55, finalY + 45, { align: "center" });
    doc.text("Firma Consultor", 155, finalY + 45, { align: "center" });

    // Descargar
    doc.save(`Reporte_${razonSocialSelect.replace(/\s+/g, '_')}_${nombreMes}_${anioSeleccionado}.pdf`);
  };

  if (loading && clientes.length === 0) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  const currentYear = new Date().getFullYear();
  const añosDisponibles = Array.from({length: 5}, (_, i) => (currentYear - 2 + i).toString());
  const meses = [
    {val: '01', label: 'Enero'}, {val: '02', label: 'Febrero'}, {val: '03', label: 'Marzo'},
    {val: '04', label: 'Abril'}, {val: '05', label: 'Mayo'}, {val: '06', label: 'Junio'},
    {val: '07', label: 'Julio'}, {val: '08', label: 'Agosto'}, {val: '09', label: 'Septiembre'},
    {val: '10', label: 'Octubre'}, {val: '11', label: 'Noviembre'}, {val: '12', label: 'Diciembre'}
  ];

  return (
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties} 
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pb-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <Link href="/reportes" className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm hover:text-primary transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Reporte Mensual</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Desglose de rentabilidad por período.</p>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
          {clienteId && datosMes && (
            <button 
              onClick={generarPDFNativo} 
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl font-bold transition-all shadow-lg hover:scale-105"
            >
              <FileText size={18} />
              <span className="hidden sm:inline">Descargar PDF</span>
            </button>
          )}

          <div className="relative flex-1 md:w-32 group">
            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10 pointer-events-none" />
            <select 
              value={mesSeleccionado} 
              onChange={(e) => setMesSeleccionado(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm hover:border-primary/30"
            >
              {meses.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
          </div>

          <div className="relative flex-1 md:w-28 group">
            <select 
              value={anioSeleccionado} 
              onChange={(e) => setAnioSeleccionado(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm hover:border-primary/30 text-center"
            >
              {añosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-full md:w-auto min-w-[240px] group">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10 pointer-events-none" />
            <select 
              value={clienteId} 
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 pl-11 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm hover:border-primary/30"
            >
              <option value="">Seleccionar Empresa...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>

      {!clienteId ? (
        <div className="max-w-7xl mx-auto h-[40vh] flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <PieIcon size={64} className="mb-4 opacity-10" />
          <p className="font-bold tracking-wide uppercase text-xs">Seleccioná un cliente para empezar</p>
        </div>
      ) : !datosMes ? (
        <div className="max-w-7xl mx-auto h-[40vh] flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <PieIcon size={64} className="mb-4 opacity-10" />
          <p className="font-bold tracking-wide uppercase text-xs text-center">Sin cierre en {meses.find(m => m.val === mesSeleccionado)?.label} {anioSeleccionado}.<br/><span className="text-[10px] font-normal opacity-70">Validá el mes desde Contabilidad.</span></p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 text-slate-500 mb-2 font-bold text-xs uppercase tracking-widest">
                  <DollarSign size={16} className="text-emerald-500"/> Ingresos Netos
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">${datosMes.ingresos.toLocaleString('es-AR', {maximumFractionDigits:0})}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 text-slate-500 mb-2 font-bold text-xs uppercase tracking-widest">
                  <TrendingUp size={16} className="text-red-500"/> Egresos Totales
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">${datosMes.gastosTotales.toLocaleString('es-AR', {maximumFractionDigits:0})}</h3>
            </div>
            <div className={`p-6 rounded-3xl border shadow-sm ${datosMes.utilidad >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200' : 'bg-red-50 dark:bg-red-500/10 border-red-200'}`}>
                <div className={`flex items-center gap-3 mb-2 font-bold text-xs uppercase tracking-widest ${datosMes.utilidad >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  <Percent size={16}/> Utilidad Mensual
                </div>
                <h3 className={`text-3xl font-black ${datosMes.utilidad >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  ${datosMes.utilidad.toLocaleString('es-AR', {maximumFractionDigits:0})}
                </h3>
                <p className={`text-sm font-bold mt-1 ${datosMes.utilidad >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Margen: {datosMes.margen}%</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Estructura de Egresos</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="h-[300px] w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosMes.desgloseGastos}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {datosMes.desgloseGastos.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                    formatter={(value: any) => `$${Number(value || 0).toLocaleString('es-AR')}`}
                    contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                {datosMes.desgloseGastos.map((gasto: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: gasto.color }}></div>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate max-w-[130px]" title={gasto.name}>{gasto.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 dark:text-white">${gasto.value.toLocaleString('es-AR', {maximumFractionDigits:0})}</span>
                      <p className="text-xs text-slate-400 font-bold">
                        {datosMes.gastosTotales > 0 ? ((gasto.value / datosMes.gastosTotales) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}