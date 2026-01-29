"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building, MapPin, Mail, Loader2, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function NuevoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accentColor, setAccentColor] = useState('208, 255, 0'); // Color default

  const [formData, setFormData] = useState({
    razon_social: '',
    cuit: '',
    condicion_iva: 'Responsable Inscripto',
    email: '',
    telefono: '',
    domicilio: '',
  });

  // 1. CARGAR COLOR DE MARCA
  useEffect(() => {
    const cargarConfig = async () => {
      const { data } = await supabase.from('configuracion').select('color_primario').single();
      if (data?.color_primario) {
        const hex = data.color_primario.replace('#', '');
        setAccentColor(`${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`);
      }
    };
    cargarConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const guardarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación básica
    if (!formData.razon_social || !formData.cuit) {
        toast.warning("Faltan datos obligatorios (Razón Social o CUIT)");
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase
        .from('clientes')
        .insert([
          {
            razon_social: formData.razon_social,
            cuit: formData.cuit,
            condicion_iva: formData.condicion_iva,
            email: formData.email,
            telefono: formData.telefono,
            domicilio: formData.domicilio,
            contacto: 'Administración',
            estado: 'Al día'
          }
        ]);

      if (error) throw error;

      toast.success('¡Cliente creado correctamente!');
      router.push('/clientes'); 
      router.refresh(); 

    } catch (error: any) {
      console.error(error);
      toast.error('Error al guardar: ' + (error.message || 'Intente nuevamente'));
    } finally {
      setLoading(false);
    }
  };

  return (
    // INYECCIÓN DE COLOR DINÁMICO
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
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Nuevo Cliente</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Registra una nueva empresa en la cartera.</p>
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
              onClick={guardarCliente}
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:brightness-110 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Creando...' : 'Guardar Cliente'}
            </button>
          </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={guardarCliente} className="space-y-8 pb-20">
          
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
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Razón Social / Denominación *</label>
                <input 
                  name="razon_social"
                  onChange={handleChange}
                  required
                  type="text" 
                  placeholder="Ej: Tech Solutions S.A."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CUIT *</label>
                <input 
                  name="cuit"
                  onChange={handleChange}
                  required
                  type="text" 
                  placeholder="30-12345678-9"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Condición IVA</label>
                <select 
                  name="condicion_iva"
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
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Contacto y Localización</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Mail size={12} className="text-primary" /> Email de Contacto
                </label>
                <input 
                  name="email"
                  onChange={handleChange}
                  type="email" 
                  placeholder="ejemplo@empresa.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Phone size={12} className="text-primary" /> Teléfono / WhatsApp
                </label>
                <input 
                  name="telefono"
                  onChange={handleChange}
                  type="tel" 
                  placeholder="+54 264 4556677"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Domicilio Legal</label>
                <input 
                  name="domicilio"
                  onChange={handleChange}
                  type="text" 
                  placeholder="Calle, Número, Ciudad, Provincia"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white transition-all font-bold"
                />
              </div>
            </div>
          </div>
          
          {/* Botón invisible para permitir envío con 'Enter' */}
          <button type="submit" className="hidden"></button>
        </form>
      </div>
    </div>
  );
}