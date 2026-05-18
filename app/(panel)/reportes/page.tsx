"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, ArrowLeft, Loader2, User, 
  PieChart, Landmark, ArrowUpRight,
  ChevronDown, Download, FileText, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Importamos librerías para PDF Nativo
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportesContablesPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);
  
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear().toString());
  const [razonSocialSelect, setRazonSocialSelect] = useState('');
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

  const fetchEvolucion = async (id: string, anio: string) => {
    if (!id) return;
    setLoading(true);
    const nombre = clientes.find(c => c.id === id)?.razon_social || 'Cliente';
    setRazonSocialSelect(nombre);

    try {
      const fechaInicio = `${anio}-01-01`;
      const fechaFin = `${anio}-12-31`;

      const { data, error } = await supabase
        .from('estados_financieros')
        .select('*')
        .eq('cliente_id', id)
        .gte('periodo', fechaInicio)
        .lte('periodo', fechaFin)
        .order('periodo', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        setReportData([]);
        setLoading(false);
        return;
      }

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      const formatted = data.map(d => {
        const parts = d.periodo.split('-'); 
        const monthIndex = parseInt(parts[1]) - 1; 

        const ingresos = (d.ventas_totales || 0) + (d.otros_ingresos || 0);
        const gastos = (d.costo_ventas || 0) + (d.gastos_operativos || 0) + (d.impuestos || 0);
        
        return {
          fullDate: d.periodo,
          name: meses[monthIndex] || 'Mes',
          Ingresos: ingresos,
          Gastos: gastos,
          Utilidad: ingresos - gastos,
          Patrimonio: d.patrimonio_neto || 0,
          Aportes: d.aporte_socios || 0,
          Retiros: d.retiros_socios || 0
        };
      });

      setReportData(formatted);
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if(clienteId) fetchEvolucion(clienteId, anioSeleccionado); 
  }, [clienteId, anioSeleccionado]);

  const descargarExcel = async () => { /* Lógica intacta para tu Excel */ };

  // --- NUEVA FUNCIÓN PARA PDF ANUAL NATIVO ---
  const generarPDFNativo = () => {
    if (reportData.length === 0) return toast.error("No hay datos para exportar");
    
    const doc = new jsPDF();
    const colorPrimario: [number, number, number] = [59, 130, 246]; // Azul Excelsa

    // --- ENCABEZADO ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("EXCELSA", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Consultoría Empresarial", 14, 26);

    // --- DATOS DEL CLIENTE ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(razonSocialSelect, 196, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Reporte Financiero Consolidado • ${anioSeleccionado}`, 196, 26, { align: "right" });

    // Línea divisoria
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // --- RESUMEN ANUAL ---
    const picoUtilidad = reportData.reduce((prev, current) => (prev.Utilidad > current.Utilidad) ? prev : current).name;
    const promMensual = reportData.reduce((acc, curr) => acc + curr.Utilidad, 0) / reportData.length;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Resumen Anual", 14, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Mes de mayor Utilidad: ${picoUtilidad}`, 14, 53);
    doc.text(`Promedio de Utilidad Mensual: $ ${promMensual.toLocaleString('es-AR', {maximumFractionDigits: 0})}`, 14, 59);

    // --- TABLA DE EVOLUCIÓN MENSUAL ---
    const tableData = reportData.map(d => [
      d.name,
      `$ ${d.Ingresos.toLocaleString('es-AR', {maximumFractionDigits: 0})}`,
      `$ ${d.Gastos.toLocaleString('es-AR', {maximumFractionDigits: 0})}`,
      `$ ${d.Utilidad.toLocaleString('es-AR', {maximumFractionDigits: 0})}`
    ]);

    autoTable(doc, {
      startY: 68,
      head: [['Período', 'Ingresos Totales', 'Egresos Totales', 'Utilidad Neta']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: colorPrimario, textColor: 255, fontStyle: 'bold', halign: 'center' },
      styles: { font: 'helvetica', fontSize: 10, textColor: [71, 85, 105], halign: 'right' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' } // El mes alineado a la izquierda
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // --- SECCIÓN DE FIRMAS ---
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    
    doc.setDrawColor(15, 23, 42);
    doc.line(30, finalY + 40, 80, finalY + 40); 
    doc.line(130, finalY + 40, 180, finalY + 40); 

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Aprobación Cliente", 55, finalY + 45, { align: "center" });
    doc.text("Firma Consultor", 155, finalY + 45, { align: "center" });

    // Descargar
    doc.save(`Reporte_Anual_${razonSocialSelect.replace(/\s+/g, '_')}_${anioSeleccionado}.pdf`);
  };

  if (loading && clientes.length === 0) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  const currentYear = new Date().getFullYear();
  const añosDisponibles = Array.from({length: 5}, (_, i) => (currentYear - 2 + i).toString());

  return (
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties} 
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pb-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm hover:text-primary transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Análisis Comparativo</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Evolución financiera anual.</p>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full xl:w-auto items-center">
           
           <Link 
             href="/reportes/mensual" 
             className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl font-bold transition-all shadow-sm hover:border-primary/30 hover:text-primary group"
             title="Ver Reporte Mensual Detallado"
           >
             <PieChart size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
             <span className="whitespace-nowrap">Reporte Mensual</span>
           </Link>

           {clienteId && reportData.length > 0 && (
             <div className="flex gap-2 w-full md:w-auto">
               <button 
                 onClick={descargarExcel} 
                 disabled={exporting}
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                 title="Descargar Excel"
               >
                 {exporting ? <Loader2 size={18} className="animate-spin"/> : <Download size={18} />}
               </button>
               <button 
                 onClick={generarPDFNativo} 
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl font-bold transition-all shadow-lg hover:scale-105"
                 title="Generar PDF Ejecutivo"
               >
                 <FileText size={18} />
                 <span className="hidden sm:inline">PDF Nativo</span>
               </button>
             </div>
           )}

           <div className="relative flex-1 md:w-32 group">
            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10 pointer-events-none" />
            <select 
              value={anioSeleccionado} 
              onChange={(e) => setAnioSeleccionado(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm hover:border-primary/30"
            >
              {añosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
          </div>

           <div className="relative w-full md:w-auto min-w-[280px] group">
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
        <div className="max-w-7xl mx-auto h-[50vh] flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <PieChart size={64} className="mb-4 opacity-10" />
           <p className="font-bold tracking-wide uppercase text-xs">Seleccioná un cliente para ver el reporte</p>
        </div>
      ) : reportData.length === 0 ? (
        <div className="max-w-7xl mx-auto h-[50vh] flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <Landmark size={64} className="mb-4 opacity-10" />
           <p className="font-bold tracking-wide uppercase text-xs text-center">No hay Cierres Validados en {anioSeleccionado}.<br/><span className="text-[10px] font-normal opacity-70">Cambia de año o guarda un cierre en Contabilidad.</span></p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8">
                <TrendingUp size={20} className="text-emerald-500" /> Ingresos vs Egresos ({anioSeleccionado})
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#f8fafc'}} 
                        itemStyle={{color: '#f8fafc'}}
                        cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
                    <Bar name="Ingresos" dataKey="Ingresos" fill={`rgb(${accentColor})`} radius={[6, 6, 0, 0]} />
                    <Bar name="Gastos Totales" dataKey="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8">
                <Landmark size={20} className="text-primary" /> Tendencia de Utilidad Neta
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData}>
                    <defs>
                      <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`rgb(${accentColor})`} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={`rgb(${accentColor})`} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                    <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#f8fafc'}} 
                        itemStyle={{color: '#f8fafc'}}
                    />
                    <Area type="monotone" dataKey="Utilidad" stroke={`rgb(${accentColor})`} strokeWidth={4} fillOpacity={1} fill="url(#colorUtil)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center gap-6 relative z-10">
                 <div className="p-5 bg-white/5 rounded-2xl text-primary border border-white/10">
                   <ArrowUpRight size={32} />
                 </div>
                 <div>
                    <h4 className="text-white text-2xl font-black tracking-tight">Resultados Consolidados {anioSeleccionado}</h4>
                    <p className="text-slate-400 text-sm">Documento privado. Preparado por Excelsa.</p>
                 </div>
              </div>
              <div className="flex gap-4 relative z-10 w-full md:w-auto">
                 <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex-1 md:flex-none min-w-[160px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mes de mayor Utilidad</p>
                    <p className="text-white font-bold text-lg">{reportData.length > 0 ? reportData.reduce((prev, current) => (prev.Utilidad > current.Utilidad) ? prev : current).name : '---'}</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex-1 md:flex-none min-w-[160px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Promedio Mensual</p>
                    <p className="text-emerald-400 font-bold text-lg">
                     $ {(reportData.reduce((acc, curr) => acc + curr.Utilidad, 0) / (reportData.length || 1)).toLocaleString('es-AR', {maximumFractionDigits: 0})}
                    </p>
                 </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}