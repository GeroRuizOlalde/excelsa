"use client";

import { useState, useEffect } from 'react';
import { Save, Building, MapPin, Mail, Phone, Palette, Loader2, Plus, Trash2, Info, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [perfiles, setPerfiles] = useState<any[]>([]);
  const [perfilActivo, setPerfilActivo] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nombre_empresa: '',
    cuit: '',
    direccion: '',
    email: '',
    telefono: '',
    color_primario: '#d0ff00' // Default Riva Neon
  });

  // --- HELPER: CONVERTIR HEX A RGB PARA TAILWIND ---
  // Esto permite que funcionen las clases como bg-primary/20
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
    return '208, 255, 0'; // Fallback
  }

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    try {
      const { data, error } = await supabase.from('configuracion').select('*').order('id', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPerfiles(data);
        if (!perfilActivo) {
            const inicial = data[0];
            setPerfilActivo(inicial.id);
            actualizarCampos(inicial);
        } else {
            const actual = data.find(p => p.id === perfilActivo);
            if (actual) actualizarCampos(actual);
        }
      } else {
          agregarNuevoPerfil();
      }
    } catch (error) { 
      console.error(error);
      toast.error("Error al cargar las identidades");
    } finally { 
      setLoading(false); 
    }
  };

  const actualizarCampos = (perfil: any) => {
    setFormData({
      nombre_empresa: perfil.nombre_empresa || '', 
      cuit: perfil.cuit || '',
      direccion: perfil.direccion || '',
      email: perfil.email || '',
      telefono: perfil.telefono || '',
      color_primario: perfil.color_primario || '#d0ff00'
    });
  };

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('configuracion')
        .update(formData)
        .eq('id', perfilActivo);

      if (error) throw error;
      
      toast.success('Identidad actualizada correctamente.');
      
      // Actualizamos la lista localmente
      const { data } = await supabase.from('configuracion').select('*').order('id', { ascending: true });
      if (data) setPerfiles(data);
      
    } catch (error: any) { 
      toast.error('Error al guardar: ' + error.message); 
    } finally { setGuardando(false); }
  };

  const agregarNuevoPerfil = async () => {
    const nuevo = { 
      nombre_empresa: 'Nueva Identidad Fiscal', 
      color_primario: '#d0ff00',
      direccion: '',
      email: '',
      telefono: '',
      cuit: ''
    };
    
    const { data, error } = await supabase.from('configuracion').insert(nuevo).select().single();
    
    if (!error && data) {
      toast.success("Nueva identidad creada.");
      setPerfiles([...perfiles, data]);
      setPerfilActivo(data.id); 
      actualizarCampos(data);
    } else {
      toast.error("No se pudo añadir el perfil");
    }
  };

  const eliminarPerfil = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (perfiles.length === 1) return toast.warning("Debes mantener al menos una identidad activa.");
    
    // Usamos toast.promise para una mejor UX
    const promesa = new Promise(async (resolve, reject) => {
        const { error } = await supabase.from('configuracion').delete().eq('id', id);
        if (error) {
            if (error.code === '23503') return reject("Tiene facturas asociadas. No se puede eliminar.");
            return reject(error.message);
        }
        
        const restantes = perfiles.filter(p => p.id !== id);
        setPerfiles(restantes);
        if (perfilActivo === id && restantes.length > 0) {
            setPerfilActivo(restantes[0].id);
            actualizarCampos(restantes[0]);
        }
        resolve("Perfil eliminado");
    });

    toast.promise(promesa, {
        loading: 'Eliminando...',
        success: (msg) => `${msg}`,
        error: (msg) => `${msg}`
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const aplicarRivaNeon = () => {
      setFormData({...formData, color_primario: '#d0ff00'});
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 gap-2">
      <Loader2 className="animate-spin text-primary" size={32} />
      <span className="font-bold uppercase tracking-widest text-xs">Cargando Identidades...</span>
    </div>
  );

  return (
    // AQUÍ OCURRE LA MAGIA: Convertimos el HEX a RGB para la variable CSS
    <div style={{ '--primary': hexToRgb(formData.color_primario) } as React.CSSProperties} className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Configuración de Marca</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona tus perfiles de facturación (Multi-Emisor).</p>
          </div>
          <button 
            onClick={agregarNuevoPerfil}
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm w-full md:w-auto hover:border-primary/50"
          >
            <Plus size={18} className="text-primary" /> Añadir Identidad
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTA DE PERFILES (SIDEBAR) */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-2">Emisores Registrados</h2>
            <div className="space-y-3">
              {perfiles.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => { setPerfilActivo(p.id); actualizarCampos(p); }}
                  className={`group p-4 rounded-2xl cursor-pointer border transition-all relative ${
                    perfilActivo === p.id 
                    ? 'bg-white dark:bg-slate-900 border-primary shadow-lg ring-1 ring-primary/50' 
                    : 'bg-slate-100/50 dark:bg-slate-900/40 border-transparent hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900" style={{ backgroundColor: p.color_primario }}></div>
                      <span className={`font-bold text-sm ${perfilActivo === p.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        {p.nombre_empresa || 'Sin Nombre'}
                      </span>
                    </div>
                    {perfiles.length > 1 && (
                        <button 
                        onClick={(e) => eliminarPerfil(p.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                        title="Eliminar Perfil"
                        >
                        <Trash2 size={14} />
                        </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono tracking-wider ml-6 truncate">
                    {p.cuit ? `CUIT: ${p.cuit}` : 'Falta configurar CUIT'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FORMULARIO DE EDICIÓN */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={guardarCambios} className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              
              {/* Barra de estado */}
              <div className="flex flex-wrap items-center justify-between mb-10 pb-6 border-b border-slate-50 dark:border-slate-800 gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Palette size={24} />
                  </div>
                  <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Editar Perfil</h2>
                      <p className="text-xs text-slate-400 font-medium">ID: {perfilActivo}</p>
                  </div>
                </div>
                <div 
                  className="px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: formData.color_primario }}
                >
                  <span className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></span>
                  Previsualización
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Razón Social / Nombre Fantasía</label>
                  <input 
                    type="text" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 outline-none transition-all dark:text-white font-bold text-lg focus:ring-primary/50" 
                    placeholder="Ej: Riva Estudio S.A."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Número de CUIT</label>
                  <input 
                    type="text" name="cuit" value={formData.cuit} onChange={handleChange} 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none dark:text-white font-mono focus:ring-2 focus:ring-primary/50" 
                    placeholder="20-xxxxxxxx-x"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Color de Marca</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <input type="color" name="color_primario" value={formData.color_primario} onChange={handleChange} className="h-10 w-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                        <span className="text-sm font-mono font-black text-slate-600 dark:text-slate-300 uppercase">{formData.color_primario}</span>
                    </div>
                    <button type="button" onClick={aplicarRivaNeon} className="bg-[#d0ff00] h-full px-4 rounded-2xl text-[10px] font-black text-slate-900 hover:brightness-110 transition-all shadow-sm" title="Usar Amarillo Riva">
                        RIVA
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2"><Mail size={14} className="text-primary"/> Email corporativo</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 outline-none focus:border-primary dark:text-white transition-colors" placeholder="administracion@estudio.com"/>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2"><Phone size={14} className="text-primary"/> Teléfono / WhatsApp</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 outline-none focus:border-primary dark:text-white transition-colors" placeholder="+54 9 ..."/>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2"><MapPin size={14} className="text-primary"/> Domicilio Legal</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 outline-none focus:border-primary dark:text-white transition-colors" placeholder="Calle, Ciudad, Provincia"/>
                      </div>
                    </div>
                    
                    {/* TARJETA DE PREVISUALIZACIÓN */}
                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase text-center tracking-[0.2em]">Previsualización</p>
                      <div className="bg-slate-950 rounded-3xl p-6 text-white flex flex-col justify-between shadow-2xl h-full min-h-[200px] relative overflow-hidden group border border-white/5 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-700"></div>
                        <div className="flex justify-between items-start relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg"><Building size={20}/></div>
                          <div className="text-[9px] opacity-40 font-mono text-right">
                              ORIGINAL<br/>COMPROBANTE
                          </div>
                        </div>
                        <div className="relative z-10 mt-auto">
                          <p className="text-xl font-black truncate tracking-tighter leading-tight">{formData.nombre_empresa || 'NOMBRE EMPRESA'}</p>
                          <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mt-1">CUIT: {formData.cuit || 'XX-XXXXXXXX-X'}</p>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 mt-4 rounded-full overflow-hidden relative z-10 shadow-inner">
                          <div className="h-full bg-primary w-[60%] transition-all duration-700 ease-out"></div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center gap-4 justify-between relative z-10">
                <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                    <Info size={14} className="text-primary"/>
                    <span>Los cambios de color impactan en todo el panel.</span>
                </div>
                <button 
                  type="submit" 
                  disabled={guardando}
                  style={{ backgroundColor: formData.color_primario }}
                  className="flex items-center justify-center gap-3 text-slate-900 px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl hover:brightness-110 hover:scale-[1.02] active:scale-95 disabled:opacity-50 w-full md:w-auto shadow-primary/20"
                >
                  {guardando ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}