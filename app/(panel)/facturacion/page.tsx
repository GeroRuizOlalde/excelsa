"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Filter, FileText, Download, MoreHorizontal, TrendingUp, 
  AlertCircle, Clock, ArrowLeft, Loader2, MessageCircle, Ban, 
  CheckCircle, RefreshCcw, Edit, UserCheck, FileSpreadsheet, Copy,
  Trash2, Send
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// INTERFAZ ACTUALIZADA
interface Factura {
  id: number;
  created_at: string;
  fecha: string;
  vencimiento: string;
  total: number;
  estado: string;
  numero_comprobante: number;
  clientes: {
    razon_social: string;
    cuit: string;
    condicion_iva: string;
    domicilio: string;
    telefono: string;
    email: string;
  };
  configuracion?: {
    nombre_empresa: string;
    cuit: string;
    direccion: string;
    color_primario: string;
  };
}

interface ConfigEmpresa {
  id: number;
  nombre_empresa: string;
  cuit: string;
  direccion: string;
  email: string;
  telefono: string;
  color_primario: string;
}

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [configs, setConfigs] = useState<ConfigEmpresa[]>([]);
  const [configSeleccionada, setConfigSeleccionada] = useState<ConfigEmpresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // RGB para Tailwind

  const [totalMes, setTotalMes] = useState(0);
  const [totalPendiente, setTotalPendiente] = useState(0);
  const [totalVencido, setTotalVencido] = useState(0);

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

  // Efecto para actualizar el color cuando cambia el perfil seleccionado
  useEffect(() => {
    if (configSeleccionada?.color_primario) {
        setAccentColor(hexToRgb(configSeleccionada.color_primario));
    }
  }, [configSeleccionada]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        const [facturasRes, configsRes] = await Promise.all([
          supabase.from('facturas')
            .select('*, clientes(razon_social, cuit, condicion_iva, domicilio, telefono, email), configuracion(*)')
            .order('id', { ascending: false }),
          
          supabase.from('configuracion').select('*').order('id')
        ]);

        if (facturasRes.error) throw facturasRes.error;
        
        if (configsRes.data && configsRes.data.length > 0) {
          setConfigs(configsRes.data);
          // Seleccionamos el primero por defecto
          setConfigSeleccionada(configsRes.data[0]);
        }

        let facturasData = (facturasRes.data || []).map((f: any) => ({
          ...f,
          clientes: f.clientes || { razon_social: 'Consumidor Final', cuit: '', telefono: '' },
          // Normalización si viene como array
          configuracion: Array.isArray(f.configuracion) ? f.configuracion[0] : f.configuracion
        }));

        // Actualizar vencidas localmente
        const hoy = new Date();
        const idsVencidos: number[] = [];
        facturasData = facturasData.map((f: Factura) => {
            const fechaVencimiento = new Date(f.vencimiento + 'T23:59:59');
            if (f.estado === 'Pendiente' && hoy > fechaVencimiento) {
                idsVencidos.push(f.id);
                return { ...f, estado: 'Vencida' };
            }
            return f;
        });

        // Sync silencioso de vencidas
        if (idsVencidos.length > 0) {
            supabase.from('facturas').update({ estado: 'Vencida' }).in('id', idsVencidos).then();
        }

        setFacturas(facturasData);
        calcularTotales(facturasData);

      } catch (error) { 
        console.error(error);
        toast.error("Error al sincronizar con la base de datos");
      } finally { setLoading(false); }
    };
    fetchDatos();
  }, []);

  const calcularTotales = (datos: Factura[]) => {
    const total = datos.filter(f => f.estado !== 'Anulada').reduce((acc, curr) => acc + curr.total, 0);
    setTotalMes(total);
    const pendiente = datos.filter(f => f.estado === 'Pendiente').reduce((acc, curr) => acc + curr.total, 0);
    setTotalPendiente(pendiente);
    const vencido = datos.filter(f => f.estado === 'Vencida').reduce((acc, curr) => acc + curr.total, 0);
    setTotalVencido(vencido);
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    const facturasActualizadas = facturas.map(f => f.id === id ? { ...f, estado: nuevoEstado } : f);
    setFacturas(facturasActualizadas);
    calcularTotales(facturasActualizadas);
    setMenuAbierto(null);
    const { error } = await supabase.from('facturas').update({ estado: nuevoEstado }).eq('id', id);
    
    if (!error) {
      toast.success(`Comprobante marcado como ${nuevoEstado}`);
    } else {
      toast.error("No se pudo actualizar el estado");
    }
  };

  const eliminarFactura = async (id: number) => {
    if (!confirm('⚠️ ¿Estás seguro de eliminar esta factura definitivamente?\n\nEsta acción borrará el registro y sus items asociados.')) return;

    const toastId = toast.loading("Eliminando factura...");

    try {
        await supabase.from('detalles_factura').delete().eq('factura_id', id);
        const { error } = await supabase.from('facturas').delete().eq('id', id);

        if (error) throw error;

        const nuevasFacturas = facturas.filter(f => f.id !== id);
        setFacturas(nuevasFacturas);
        calcularTotales(nuevasFacturas);
        setMenuAbierto(null);

        toast.success("Factura eliminada correctamente", { id: toastId });
    } catch (err: any) {
        console.error(err);
        if (err.code === '23503') {
            toast.error("No se puede eliminar: tiene pagos o movimientos asociados.", { id: toastId });
        } else {
            toast.error("Error al eliminar la factura", { id: toastId });
        }
    }
  };

  const exportarExcel = async () => {
    const toastId = toast.loading("Diseñando reporte Excel...");
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Facturación');

      worksheet.columns = [
        { header: 'FECHA', key: 'fecha', width: 15 },
        { header: 'COMPROBANTE', key: 'numero', width: 22 },
        { header: 'EMISOR', key: 'emisor', width: 30 },
        { header: 'CLIENTE', key: 'cliente', width: 40 },
        { header: 'CUIT', key: 'cuit', width: 18 },
        { header: 'ESTADO', key: 'estado', width: 15 },
        { header: 'TOTAL', key: 'total', width: 18 },
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      headerRow.height = 28;

      facturasFiltradas.forEach(f => {
        const row = worksheet.addRow({
          fecha: new Date(f.fecha).toLocaleDateString('es-AR'),
          numero: formatearNumero(f.numero_comprobante),
          emisor: f.configuracion?.nombre_empresa || 'Desconocido',
          cliente: f.clientes?.razon_social,
          cuit: f.clientes?.cuit,
          estado: f.estado.toUpperCase(),
          total: f.total
        });

        const totalCell = row.getCell('total');
        totalCell.numFmt = '"$"#,##0.00';
        totalCell.font = { bold: true };

        const estadoCell = row.getCell('estado');
        if (f.estado === 'Pagada') estadoCell.font = { color: { argb: 'FF10B981' }, bold: true };
        if (f.estado === 'Vencida') estadoCell.font = { color: { argb: 'FFEF4444' }, bold: true };
        if (f.estado === 'Pendiente') estadoCell.font = { color: { argb: 'FFF59E0B' }, bold: true };

        row.getCell('fecha').alignment = { horizontal: 'center' };
        row.getCell('estado').alignment = { horizontal: 'center' };
      });

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Listado_Facturacion_${new Date().toISOString().slice(0, 10)}.xlsx`);

      toast.success("Reporte Excel generado con éxito", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Error al exportar el archivo", { id: toastId });
    }
  };

  const generarPDF = (factura: Factura, tipo: 'FACTURA' | 'LIQUIDACION') => {
    const doc = new jsPDF();
    
    // Usar el emisor REAL de la factura
    const emisorReal = factura.configuracion || configSeleccionada; 
    
    // Parsear color HEX a array [R, G, B] para jsPDF
    const hexColor = emisorReal?.color_primario || '#d0ff00';
    let colorPrincipal = [208, 255, 0]; // Default Riva
    
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)){
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        colorPrincipal = [r, g, b];
    }

    doc.setFillColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.rect(0, 0, 6, 297, 'F');
    doc.setTextColor(40);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(emisorReal?.nombre_empresa || 'EMPRESA DESCONOCIDA', 15, 25);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`CUIT: ${emisorReal?.cuit || 'Sin CUIT'}`, 15, 30);
    doc.text(emisorReal?.direccion || 'Domicilio Comercial', 15, 38);
    doc.setFontSize(10);
    let tituloDoc = tipo === 'FACTURA' ? 'FACTURA' : 'LIQUIDACIÓN DE HONORARIOS';
    doc.text(tituloDoc, 195, 25, { align: 'right' });
    doc.setFontSize(14);
    doc.setTextColor(40);
    const numeroMostrar = tipo === 'FACTURA' ? formatearNumero(factura.numero_comprobante) : `REF-${factura.id}`;
    doc.text(`Nº ${numeroMostrar}`, 195, 32, { align: 'right' });
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString('es-AR')}`, 195, 40, { align: 'right' });

    if (tipo === 'FACTURA') {
        doc.rect(98, 10, 14, 14);
        doc.setFontSize(20);
        doc.text("A", 105, 20, { align: "center" });
    }

    autoTable(doc, {
      startY: 95,
      head: [['DESCRIPCIÓN', 'CANT', 'PRECIO UNIT.', 'TOTAL']],
      body: [['Servicios Profesionales', '1', `$ ${factura.total.toLocaleString('es-AR')}`, `$ ${factura.total.toLocaleString('es-AR')}`]],
      theme: 'grid',
      headStyles: { fillColor: colorPrincipal as [number, number, number], textColor: 255, fontStyle: 'bold' },
    });

    const nombre = `${tipo}-${factura.numero_comprobante}.pdf`;
    doc.save(nombre);
    toast.info(`Descargando documento de ${emisorReal?.nombre_empresa}...`);
    return nombre;
  };

  const gestionarEnvioWhatsApp = (factura: Factura, modo: 'COBRANZA' | 'AGRADECIMIENTO') => {
    const telefono = factura.clientes.telefono;
    if (!telefono) return toast.error('El cliente no tiene teléfono registrado.');
    
    const miEmpresa = factura.configuracion?.nombre_empresa || configSeleccionada?.nombre_empresa || 'Nosotros';
    
    generarPDF(factura, modo === 'COBRANZA' ? 'LIQUIDACION' : 'FACTURA');
    
    const mensaje = modo === 'COBRANZA' ? `Hola *${factura.clientes.razon_social}*! 👋\nDesde *${miEmpresa}* le enviamos su liquidación.` : `Hola *${factura.clientes.razon_social}*! 👋\nRecibimos su pago. Adjuntamos factura de *${miEmpresa}*.`;
    
    toast.info("Abriendo WhatsApp Web...");
    window.open(`https://api.whatsapp.com/send?phone=${telefono.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const facturasFiltradas = facturas.filter(f => f.clientes.razon_social.toLowerCase().includes(busqueda.toLowerCase()));
  const formatearNumero = (num: number) => `0001-${String(num).padStart(8, '0')}`;

  return (
    // INYECCION DE VARIABLE CSS RGB
    <div style={{ '--primary': accentColor } as React.CSSProperties} className="min-h-screen bg-[rgb(var(--background))] dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300" onClick={() => setMenuAbierto(null)}>
      {/* HEADER & KPIs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Facturación</h1>
            <p className="text-slate-500 text-sm">Gestión de comprobantes</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
            {/* SELECTOR DE PERFIL (Solo visual para la UI) */}
            <div className="flex flex-col flex-1 md:flex-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Perfil activo (UI):</span>
                <select 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer min-w-[200px]"
                    value={configSeleccionada?.id || ''}
                    onChange={(e) => setConfigSeleccionada(configs.find(c => c.id === parseInt(e.target.value)) || null)}
                >
                    {configs.map(c => <option key={c.id} value={c.id}>{c.nombre_empresa}</option>)}
                </select>
            </div>

            <button onClick={exportarExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><FileSpreadsheet size={18} /> <span className="hidden sm:inline">Excel</span></button>
            <Link href="/facturacion/nueva" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"><Plus size={20} /> <span className="hidden sm:inline">Nueva Factura</span></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Facturado', val: totalMes, icon: TrendingUp, color: 'text-primary' },
          { label: 'Pendiente', val: totalPendiente, icon: Clock, color: 'text-yellow-500' },
          { label: 'Vencido', val: totalVencido, icon: AlertCircle, color: 'text-red-500' }
        ].map((c, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${c.color}`}><c.icon size={24}/></div>
              <div><p className="text-xs uppercase font-bold text-slate-400">{c.label}</p><h3 className="text-xl font-black text-slate-900 dark:text-white">$ {c.val.toLocaleString('es-AR')}</h3></div>
          </div>
        ))}
      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[600px]">
        
        {/* Barra de búsqueda */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar cliente o comprobante..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-auto relative">
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 shadow-sm border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Fecha</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Nº</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Cliente</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Total</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Estado</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {facturasFiltradas.map((f, index) => {
                  const isLastRows = facturasFiltradas.length > 3 && index > facturasFiltradas.length - 3;

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(f.fecha).toLocaleDateString('es-AR', {day:'2-digit', month:'2-digit'})}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatearNumero(f.numero_comprobante)}</td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {f.clientes?.razon_social}
                        {/* Mostrar pequeñito quién emitió */}
                        <span className="block text-[9px] text-slate-400 font-normal uppercase mt-0.5">Por: {f.configuracion?.nombre_empresa || '---'}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">$ {f.total.toLocaleString('es-AR')}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                          ${f.estado === 'Pagada' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                            f.estado === 'Pendiente' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                            'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                          {f.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="flex justify-end gap-1">
                          
                          <button 
                            onClick={() => generarPDF(f, f.estado === 'Pagada' ? 'FACTURA' : 'LIQUIDACION')} 
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" 
                            title="Descargar PDF"
                          >
                            <Download size={18} />
                          </button>
                          
                          <button 
                            onClick={() => eliminarFactura(f.id)} 
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                            title="Eliminar Factura"
                          >
                            <Trash2 size={18} />
                          </button>

                          <div className="relative">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setMenuAbierto(menuAbierto === f.id ? null : f.id); }} 
                              className={`p-1.5 rounded-lg transition-colors ${menuAbierto === f.id ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            
                            {menuAbierto === f.id && (
                              <div className={`absolute right-0 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden 
                                ${isLastRows ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'} animate-in zoom-in-95 duration-100`}>
                                
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 border-b dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2">Acciones Rápidas</p>
                                    <Link 
                                      href={`/facturacion/nueva?cloneId=${f.id}`}
                                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-all mt-1 font-bold"
                                    >
                                      <Copy size={16} className="text-primary" /> Clonar Factura
                                    </Link>
                                    <button onClick={() => gestionarEnvioWhatsApp(f, 'COBRANZA')} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-all mt-1"><MessageCircle size={16} className="text-green-500" /> Enviar Liquidación</button>
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link href={`/facturacion/editar/${f.id}`} className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2"><Edit size={16} /> Editar</Link>
                                    {f.estado !== 'Pagada' && <button onClick={() => cambiarEstado(f.id, 'Pagada')} className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg flex items-center gap-2 font-bold"><CheckCircle size={16} /> Marcar Pagada</button>}
                                    <button onClick={() => { if(confirm('¿Anular?')) cambiarEstado(f.id, 'Anulada'); }} className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg flex items-center gap-2"><Ban size={16} /> Anular</button>
                                    
                                    <button onClick={() => eliminarFactura(f.id)} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 font-bold mt-1 border-t dark:border-slate-700 pt-2"><Trash2 size={16} /> Eliminar</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}