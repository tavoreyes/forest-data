import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'ForestData — Monitoreo Forestal Escolar',
  description: 'Plataforma para registrar, geolocalizar y dar seguimiento al crecimiento de arboles cuidados por alumnos.',
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ForestData'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ForestData" />
      </head>
      <body>
        {children}
        <Script
          id="service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('SW registration failed:', error);
                    });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
