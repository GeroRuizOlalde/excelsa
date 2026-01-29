"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/ThemeProvider';
import { 
  LayoutDashboard, Users, FileText, Settings, Package, 
  LogOut, Mountain, Menu, X, Sun, Moon, 
  BarChart3, PieChart // <--- PieChart importado para Análisis
} from 'lucide-react';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [accentColor, setAccentColor] = useState('37, 99, 235');
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('configuracion').select('color_primario').eq('id', 1).single();
      if (data?.color_primario) {
        const hex = data.color_primario.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        setAccentColor(`${r}, ${g}, ${b}`);
      }
    };
    fetchConfig();
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div 
      style={{ '--primary': accentColor } as React.CSSProperties}
      className="flex h-screen w-full bg-[rgb(var(--background))] text-[rgb(var(--foreground))] font-sans antialiased overflow-hidden transition-colors duration-300"
    >
      
      {/* HEADER MÓVIL */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-slate-900 dark:bg-slate-950 z-40 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-white text-slate-900 p-1 rounded-md">
            <Mountain size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-wide">EXCELSA</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={toggleTheme} className="text-white p-2">
             {isDark ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} />}
           </button>
           <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2">
             <Menu size={28} />
           </button>
        </div>
      </div>

      {/* SIDEBAR ESCRITORIO */}
      <aside className="hidden md:flex w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 flex-col shrink-0 h-full border-r border-slate-800 dark:border-slate-800">
        <SidebarContent onLogout={handleSignOut} isDark={isDark} toggleTheme={toggleTheme} />
      </aside>

      {/* SIDEBAR MÓVIL */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 w-64 h-full bg-slate-900 dark:bg-slate-950 text-slate-300 z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden flex flex-col`}>
        <div className="flex justify-between items-center p-4">
          <button onClick={toggleTheme} className="text-white p-2">
             {isDark ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><X size={28} /></button>
        </div>
        <SidebarContent onItemClick={closeMenu} onLogout={handleSignOut} isDark={isDark} toggleTheme={toggleTheme} />
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-[rgb(var(--background))] relative pt-16 md:pt-0">
         {children}
      </main>
    </div>
  );
}

function SidebarContent({ 
  onItemClick, 
  onLogout,
  isDark,
  toggleTheme
}: { 
  onItemClick?: () => void; 
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}) {
  return (
    <>
      <div className="p-6 md:flex items-center gap-3 text-white mb-6 hidden">
        <div className="bg-white text-slate-900 p-2 rounded-lg"><Mountain size={24} strokeWidth={2.5} /></div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">EXCELSA</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Gestión de Empresas</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-4 md:mt-0">Principal</p>
        
        <Link href="/dashboard" onClick={onItemClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
          <LayoutDashboard size={20} /> <span className="font-medium">Panel de Control</span>
        </Link>
        <Link href="/clientes" onClick={onItemClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
          <Users size={20} /> <span className="font-medium">Clientes</span>
        </Link>
        <Link href="/facturacion" onClick={onItemClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
          <FileText size={20} /> <span className="font-medium">Facturación</span>
        </Link>
        <Link href="/productos" onClick={onItemClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
          <Package size={20} /> <span className="font-medium">Servicios</span>
        </Link>

        <Link 
          href="/contabilidad" 
          onClick={onItemClick} 
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group"
        >
          <BarChart3 size={20} className="group-hover:text-primary transition-colors" /> 
          <span className="font-medium">Gestión Contable</span>
        </Link>

        {/* --- NUEVA SECCIÓN: ANÁLISIS DE DATOS (REPORTES) --- */}
        <Link 
          href="/reportes" 
          onClick={onItemClick} 
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group"
        >
          <PieChart size={20} className="group-hover:text-primary transition-colors" /> 
          <span className="font-medium">Análisis de Datos</span>
        </Link>

        <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-8">Sistema</p>
        
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          <span className="font-medium">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>

        <Link href="/configuracion" onClick={onItemClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
          <Settings size={20} /> <span className="font-medium">Configuración</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={20} /> <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );
}