import './globals.css';

export const metadata = {
  title: 'ForestData — Monitoreo Forestal Escolar',
  description: 'Plataforma para registrar, geolocalizar y dar seguimiento al crecimiento de arboles cuidados por alumnos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
