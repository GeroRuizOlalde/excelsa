import './globals.css';
import { Inter, Fraunces, Hanken_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { Toaster } from 'sonner';

// Panel (se mantiene en Inter)
const inter = Inter({ subsets: ['latin'] });

// Sitio público (editorial cálido)
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'opsz'],
  variable: '--font-display',
  display: 'swap',
});
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

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
      <body className={`${inter.className} ${fraunces.variable} ${hanken.variable} antialiased selection:bg-[#C15F3C]/15 selection:text-[#A84B2B]`}>
        <ThemeProvider>
          {children}
          {/* Notificaciones elegantes para el Portal de Clientes y Landing */}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}