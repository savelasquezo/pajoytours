import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })
import '@/styles/styles.css';

export const metadata: Metadata = {
  title: 'Pajoytours',
  description: 'Tours Vacacionales & Excursiones',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <head>
      <Script src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBZqamFufskOr-UaOf5WEEVHf21cgqnk7E`} strategy="beforeInteractive"/>
      </head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
