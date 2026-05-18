import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

// 1. CONFIGURACIÓN DE METADATOS PARA SEO Y PWA
export const metadata = {
  title: 'Excelsa | Consultoría Empresarial Integral', // Título optimizado para Google
  description: 'Expertos en gestión estratégica, finanzas y sostenibilidad para PyMEs en San Juan. Impulsamos el crecimiento de su empresa con visión 360°.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png', // Usamos tu nuevo logo
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Excelsa',
  },
};

// 2. CONFIGURACIÓN DEL VIEWPORT (Estética Mobile-First)
export const viewport = {
  themeColor: '#ffffff', // Fondo blanco para que la barra del celular sea limpia
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
      <body className={`${inter.className} antialiased selection:bg-blue-600/10 selection:text-blue-600`}>
        <ThemeProvider>
          {children}
          {/* Notificaciones elegantes para el Portal de Clientes y Landing */}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}