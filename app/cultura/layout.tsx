import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personas, Cultura y Clima Organizacional | Excelsa',
  description:
    'Integramos la gestión de personas a la estrategia general de su organización. Liderazgo, clima laboral, evaluación de desempeño y estructura organizacional.',
};

export default function CulturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
