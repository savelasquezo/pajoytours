import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
import '@/styles/styles.css';

export const metadata: Metadata = {
  title: 'Pajoytours',
  description: 'Tours Vacacionales & Excursiones',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
