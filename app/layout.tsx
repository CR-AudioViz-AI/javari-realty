import type { Metadata } from "next"
import Script from 'next/script';
// import { Inter } from "next/font/google"
import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CR Realtor Platform - Your Complete Real Estate Solution",
  description: "Unified realtor platform with property search, MLS integration, market analytics, and 20 social impact modules serving veterans, first responders, seniors, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}        {/* Javari AI Assistant */}
        <Script src="https://javariai.com/embed.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
