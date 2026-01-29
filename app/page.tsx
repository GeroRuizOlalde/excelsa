import Link from 'next/link';
import { Mountain, ArrowRight, ShieldCheck, BarChart3, Users2 } from 'lucide-react';

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Simple */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-1.5 rounded-lg">
            <Mountain size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">EXCELSA</span>
        </div>
        <Link 
          href="/login" 
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Iniciar Sesión
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-100">
          <ShieldCheck size={16} />
          Sistema de Gestión Contable & CRM
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Control total para <br />
          <span className="text-blue-600">tu empresa.</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Gestiona facturación, clientes y reportes en tiempo real con la plataforma 
          diseñada para optimizar la administración de Excelsa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/login" 
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Ingresar al Sistema
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Mini Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl w-full">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
              <Users2 size={24} />
            </div>
            <span className="font-semibold text-slate-800">Gestión de Clientes</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
              <BarChart3 size={24} />
            </div>
            <span className="font-semibold text-slate-800">Reportes en Vivo</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
              <ShieldCheck size={24} />
            </div>
            <span className="font-semibold text-slate-800">Acceso Seguro</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-slate-400 text-sm">
        &copy; 2026 Riva Estudio. Todos los derechos reservados.
      </footer>
    </div>
  );
}