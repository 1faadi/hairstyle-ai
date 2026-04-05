import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter } from "next/font/google"
import { AuthGreetingCard } from "@/components/shared/AuthGreetingCard"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AI Hair - Try On Any Hairstyle Instantly",
  description:
    "Transform your look in seconds - upload a photo and preview modern hairstyles with realistic AI results.",
  keywords: [
    "hairstyle AI",
    "virtual hairstyle try on",
    "AI hair changer",
    "hairstyle simulator",
    "virtual haircut",
  ],
  openGraph: {
    title: "AI Hair - Try On Any Hairstyle Instantly",
    description: "Transform your look in seconds with realistic AI hairstyle previews.",
    url: "https://hairstyleai.ai",
    siteName: "AI Hair",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Hair - Try On Any Hairstyle Instantly",
    description: "Transform your look in seconds with AI-powered hairstyle try-on.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <AuthGreetingCard />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
