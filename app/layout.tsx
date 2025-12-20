import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CR Realtor Platform - Your Complete Real Estate Solution",
  description: "Unified realtor platform with property search, MLS integration, market analytics, and CRM tools for real estate professionals.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
