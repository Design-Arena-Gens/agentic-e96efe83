import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Google Maps Business Extractor',
  description: 'Extract business data from Google Maps and export to Excel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
