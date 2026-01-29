"use client";

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, AlertCircle, 
  ArrowUpRight, Filter, 
  Loader2, DollarSign, Calendar, Activity 
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatARS } from '@/lib/utils';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  // Guardamos el color en formato RGB "208, 255, 0" para Tailwind
  const [accentColor, setAccentColor] = useState('208, 255, 0'); 
  
  // ESTADOS MULTI-EMISOR
  const [emisores, setEmisores] = useState<any[]>([]);
  const [emisorId, setEmisorId] = useState<string>('all'); 
  
  // DATOS DEL DASHBOARD
  const [kpis, setKpis] = useState({
    ingresosMes: 0,
    ingresosAnuales: 0,
    pendientes: 0,
    clientesActivos: 0,
    facturasVencidas: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [ultimasFacturas, setUltimasFacturas] = useState<any[]>([]);

  // --- HELPER PARA COLOR ---
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
    return '208, 255, 0'; // Fallback Riva
  }

  // 1. CARGA INICIAL (Config y Emisores)
  useEffect(() => {
    const init = async () => {
      try {
        const { data: emisoresData } = await supabase
            .from('configuracion')
            .select('id, nombre_empresa, color_primario')
            .order('id');
            
        setEmisores(emisoresData || []);
        
        // Color por defecto inicial
        if (emisoresData && emisoresData.length > 0) {
           setAccentColor(hexToRgb(emisoresData[0].color_primario || '#d0ff00'));
        }
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  // 2. CARGA DE DATOS (Se dispara al cambiar el Emisor o al inicio)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // --- QUERIES ---
        let queryFacturas = supabase
            .from('facturas')
            .select('*, clientes(razon_social), configuracion(nombre_empresa)');
        
        // Filtro por Emisor y Cambio de Color
        if (emisorId !== 'all') {
           queryFacturas = queryFacturas.eq('emisor_id', emisorId);
           
           const emisorActual = emisores.find(e => e.id.toString() === emisorId);
           if (emisorActual?.color_primario) {
             setAccentColor(hexToRgb(emisorActual.color_primario));
           }
        } else {
           setAccentColor('208, 255, 0'); // Volver a Default (Neon)
        }

        const { data: facturas, error } = await queryFacturas;
        if (error) throw error;

        // --- CÁLCULO DE KPIS ---
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        const ingresosMes = facturas
          ?.filter(f => {
            const [y, m, d] = f.fecha.split('-');
            const fechaF = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
            return f.estado === 'Pagada' && fechaF.getMonth() === mesActual && fechaF.getFullYear() === anioActual;
          })
          .reduce((acc, curr) => acc + curr.total, 0) || 0;

        const ingresosAnuales = facturas
          ?.filter(f => {
             const [y, m, d] = f.fecha.split('-');
             return f.estado === 'Pagada' && parseInt(y) === anioActual;
          })
          .reduce((acc, curr) => acc + curr.total, 0) || 0;

        const pendientes = facturas
          ?.filter(f => f.estado === 'Pendiente')
          .reduce((acc, curr) => acc + curr.total, 0) || 0;

        const vencidasCount = facturas?.filter(f => f.estado === 'Vencida').length || 0;
        const clientesUnicos = new Set(facturas?.map(f => f.cliente_id)).size;

        setKpis({
          ingresosMes,
          ingresosAnuales,
          pendientes,
          clientesActivos: clientesUnicos,
          facturasVencidas: vencidasCount
        });

        // --- DATOS PARA GRÁFICOS ---
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const dataPorMes = new Array(12).fill(0);
        
        facturas?.forEach(f => {
           const [y, m, d] = f.fecha.split('-');
           if (f.estado === 'Pagada' && parseInt(y) === anioActual) {
             const mesIndex = parseInt(m) - 1;
             dataPorMes[mesIndex] += f.total;
           }
        });

        const chartFormat = meses.map((mes, i) => ({
          name: mes,
          total: dataPorMes[i]
        }));
        setChartData(chartFormat);

        // --- ÚLTIMAS FACTURAS ---
        const ultimas = [...(facturas || [])]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setUltimasFacturas(ultimas);

      } catch (e) {
        toast.error("Error cargando dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [emisorId, emisores]);

  if (loading && emisores.length === 0 && emisorId === 'all') return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40}/></div>;

  return (
    // SE APLICA LA VARIABLE CSS RGB CORRECTA
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300 pb-20"
    >
      {/* HEADER CON FILTRO GLOBAL */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
              Panel de Control
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Resumen financiero en tiempo real.
            </p>
          </div>

          {/* SELECTOR DE EMISOR */}
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
               <Filter size={20} />
            </div>
            <div className="pr-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Vista Global</label>
               <select 
                 value={emisorId}
                 onChange={(e) => setEmisorId(e.target.value)}
                 className="bg-transparent font-bold text-sm text-slate-700 dark:text-white outline-none cursor-pointer w-48 appearance-none"
               >
                 <option value="all">🏢 Consolidado (Todo)</option>
                 <option disabled>──────────</option>
                 {emisores.map(e => (
                   <option key={e.id} value={e.id}>{e.nombre_empresa}</option>
                 ))}
               </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* TARJETAS KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 rounded-[2rem] p-6 border border-white/5 relative overflow-hidden shadow-xl group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/30 transition-colors"></div>
            <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-white/5 rounded-2xl text-white"><DollarSign size={24} /></div>
               <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg flex items-center gap-1">
                 <TrendingUp size={12} /> Este mes
               </span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Facturación Mes</p>
            <h3 className="text-2xl font-black text-white mt-1">{formatARS(kpis.ingresosMes)}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors group">
             <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-primary"><AlertCircle size={24} /></div>
             </div>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Cobranza Pendiente</p>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 group-hover:text-primary transition-colors">
               {formatARS(kpis.pendientes)}
             </h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors">
             <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-blue-500"><Users size={24} /></div>
             </div>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Clientes Activos</p>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.clientesActivos}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors">
             <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-orange-500"><Activity size={24} /></div>
             </div>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Acumulado Anual</p>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatARS(kpis.ingresosAnuales)}</h3>
          </div>
        </div>

        {/* GRÁFICO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <ArrowUpRight className="text-primary" /> Evolución de Ingresos
               </h3>
               <div className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                 Año Actual
               </div>
             </div>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                       {/* Recharts necesita rgb() explicito porque accentColor son solo números ahora */}
                       <stop offset="5%" stopColor={`rgb(${accentColor})`} stopOpacity={0.3}/>
                       <stop offset="95%" stopColor={`rgb(${accentColor})`} stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(val) => `$${val/1000}k`} />
                   <Tooltip 
                     contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}}
                     itemStyle={{color: `rgb(${accentColor})`}}
                     formatter={(value: any) => [formatARS(Number(value)), 'Ingresos']}
                   />
                   <Area type="monotone" dataKey="total" stroke={`rgb(${accentColor})`} strokeWidth={4} fillOpacity={1} fill="url(#colorIngresos)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>

           {/* LISTA LATERAL (Últimas Facturas) */}
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <Calendar className="text-slate-400" size={20}/> Recientes
             </h3>
             <div className="space-y-4">
               {ultimasFacturas.length > 0 ? ultimasFacturas.map((f) => (
                 <div key={f.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                          f.estado === 'Pagada' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {f.estado === 'Pagada' ? 'OK' : 'PD'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                            {f.clientes?.razon_social || 'Cliente'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                             #{f.numero_comprobante || f.id} • {new Date(f.fecha).toLocaleDateString()}
                          </p>
                        </div>
                     </div>
                     <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                       {formatARS(f.total)}
                     </p>
                  </div>
               )) : (
                 <p className="text-slate-400 text-sm italic text-center py-10">Sin movimientos recientes.</p>
               )}
               
               <Link href="/facturacion" className="block text-center text-xs font-bold text-primary hover:underline mt-6">
                 Ver todas las facturas
               </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}