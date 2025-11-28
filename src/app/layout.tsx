import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Campus Connect - Student Community',
  description: 'Connect with your campus community. Discover events, get help, and stay informed.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
