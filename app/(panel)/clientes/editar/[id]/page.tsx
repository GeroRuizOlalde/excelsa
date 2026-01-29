"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building, MapPin, Mail, Loader2, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner'; // Usamos Sonner para consistencia

export default function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // Color default

  // Estado del formulario
  const [formData, setFormData] = useState({
    razon_social: '',
    cuit: '',
    condicion_iva: 'Responsable Inscripto',
    email: '',
    telefono: '',
    domicilio: '',
  });

  // 1. DESENVOLVER PARAMS
  useEffect(() => {
    params.then(p => setClientId(p.id));
  }, [params]);

  // 2. CARGAR DATOS (CLIENTE + COLOR)
  useEffect(() => {
    if (!clientId) return;

    const cargarDatos = async () => {
      try {
        // Carga paralela para mayor velocidad
        const [resCliente, resConfig] = await Promise.all([
          supabase.from('clientes').select('*').eq('id', clientId).single(),
          supabase.from('configuracion').select('color_primario').single()
        ]);

        if (resCliente.error) throw resCliente.error;

        // Cargar datos del formulario
        if (resCliente.data) {
          setFormData({
            razon_social: resCliente.data.razon_social || '',
            cuit: resCliente.data.cuit || '',
            condicion_iva: resCliente.data.condicion_iva || 'Responsable Inscripto',
            email: resCliente.data.email || '',
            telefono: resCliente.data.telefono || '',
            domicilio: resCliente.data.domicilio || '',
          });
        }

        // Cargar Color Personalizado
        if (resConfig.data?.color_primario) {
          const hex = resConfig.data.color_primario.replace('#', '');
          setAccentColor(`${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`);
        }

      } catch (error) {
        console.error('Error al cargar:', error);
        toast.error('No se pudo cargar la información del cliente.');
        router.push('/clientes');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [clientId, router]);

  // 3. GUARDAR CAMBIOS
  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          razon_social: formData.razon_social,
          cuit: formData.cuit,
          condicion_iva: formData.condicion_iva,
          email: formData.email,
          telefono: formData.telefono,
          domicilio: formData.domicilio,
        })
        .eq('id', clientId);

      if (error) throw error;

      toast.success('Cliente actualizado correctamente');
      router.push('/clientes');
      router.refresh();

    } catch (error: any) {
      toast.error('Error al actualizar: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 gap-3 transition-colors duration-300">
      <Loader2 className="animate-spin" size={32} /> 
      <span className="font-bold text-sm">Cargando ficha...</span>
    </div>
  );

  return (
    // INYECCION DE VARIABLE CSS --primary
    <div style={{ '--primary': accentColor } as React.CSSProperties} className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/clientes" 
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-colors text-slate-500 dark:text-slate-400 shadow-sm"
            >
              <ArrowLeft size={22} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Editar Cliente</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Modifica la información fiscal y de contacto.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link 
              href="/clientes" 
              className="flex-1 md:flex-none text-center px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </Link>
            <button 
              onClick={guardarCambios}
              disabled={guardando}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              {guardando ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={guardarCambios} className="space-y-8 pb-20">
          
          {/* SECCIÓN 1: IDENTIDAD FISCAL */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-slate-800 pb-5">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Building size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Información Fiscal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Razón Social *</label>
                <input 
                  name="razon_social"
                  value={formData.razon_social}
                  onChange={handleChange}
                  required
                  type="text" 
                  placeholder="Ej: Riva Estudio S.A."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CUIT / CUIL *</label>
                <input 
                  name="cuit"
                  value={formData.cuit}
                  onChange={handleChange}
                  required
                  type="text" 
                  placeholder="30-XXXXXXXX-X"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Condición de IVA</label>
                <select 
                  name="condicion_iva"
                  value={formData.condicion_iva}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="Responsable Inscripto">Responsable Inscripto</option>
                  <option value="Monotributista">Monotributista</option>
                  <option value="Exento">Exento</option>
                  <option value="Consumidor Final">Consumidor Final</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: CONTACTO */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-slate-800 pb-5">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Localización y Contacto</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Mail size={12} className="text-primary" /> Email de Facturación
                </label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  placeholder="admin@cliente.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Phone size={12} className="text-primary" /> WhatsApp / Teléfono
                </label>
                <input 
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  type="tel" 
                  placeholder="+54 264 1234567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Domicilio Legal / Comercial</label>
                <input 
                  name="domicilio"
                  value={formData.domicilio}
                  onChange={handleChange}
                  type="text" 
                  placeholder="Av. Libertador 1234, Rivadavia, San Juan"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="hidden"></button>
        </form>
      </div>
    </div>
  );
}