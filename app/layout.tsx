import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CR Realtor Platform - Your Complete Real Estate Solution",
  description: "Unified realtor platform with property search, MLS integration, market analytics, and AI-powered tools for agents.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CR Realtor",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crrealtorplatform.com",
    siteName: "CR Realtor Platform",
    title: "CR Realtor Platform - AI-Powered Real Estate Tools",
    description: "The complete real estate platform with AI listing tools, lead management, and market analytics.",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "CR Realtor Platform",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "CR Realtor Platform",
    description: "AI-powered real estate tools for agents and brokers",
    images: ["/icons/icon-512x512.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CR Realtor" />
      </head>
      <body className="font-sans">
        {children}
        {/* 
          PWA Components (InstallPrompt, OnlineStatusIndicator, UpdateAvailableBanner)
          should be added to a client-side provider component.
          
          Javari AI is implemented as a floating button component 
          in individual pages rather than a global embed.
        */}
      </body>
    </html>
  )
}
