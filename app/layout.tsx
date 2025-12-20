import type { Metadata } from "next"
import "./globals.css"

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
      <body className="font-sans">
        {children}
        {/* 
          Javari AI is now implemented as a floating button component 
          in individual pages rather than a global embed.
          This allows better control over when and where Javari appears.
        */}
      </body>
    </html>
  )
}
