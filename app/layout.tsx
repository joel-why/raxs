import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://raxs.app'),
  title: 'Raxs | Join the Waitlist',
  description: 'Be the first to know when we launch. Sign up for our waitlist and join the movement.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Raxs | Prove What You Own',
    description: 'Be the first to know when we launch. Sign up for our waitlist and join the movement.',
    url: 'https://raxs.app',
    siteName: 'Raxs',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Raxs — Prove What You Own. Join the waitlist.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raxs | Prove What You Own',
    description: 'Be the first to know when we launch. Sign up for our waitlist and join the movement.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} scroll-smooth`} style={{ backgroundColor: '#0a0a0a' }}>
      <body className="font-sans antialiased min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#fafafa' }}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
