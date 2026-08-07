import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compliance Minero y Control de Contratistas en San Juan | Excelsa',
    description: 'Evite la responsabilidad solidaria y asegure su homologación en el RE.PRO.MIN (Ley 2827-M). Auditoría y adecuación para operadoras y proveedores mineros.',
};

export default function MineriaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}