import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

// 1. CONFIGURACIÓN DE METADATOS PWA
export const metadata = {
  title: 'Excelsa | Gestión de Empresas',
  description: 'Sistema integral de facturación y CRM para Excelsa.',
  manifest: '/manifest.json', // Vincula el archivo que creamos en public/
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Excelsa',
  },
};

// 2. CONFIGURACIÓN DEL VIEWPORT (Color de la barra del celular)
export const viewport = {
  themeColor: '#0f172a', // Slate 900 (fondo oscuro por defecto)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
          {/* Notificaciones elegantes para acciones de Riva Estudio */}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}