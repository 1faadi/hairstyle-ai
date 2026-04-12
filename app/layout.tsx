import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter } from "next/font/google"
import { AuthGreetingCard } from "@/components/shared/AuthGreetingCard"
import { ThemeProvider } from "@/components/theme-provider"
import { SITE_LOGO_PATH } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const SITE_TITLE = "Free AI Hairstyle Changer | Try 150+ Hairstyles Online in 2026"
const SITE_DESCRIPTION =
  "Try 150+ AI hairstyles and colours instantly online for men, women, and kids. You can preview your new look before the salon with our free virtual hairstyle tool."

const siteUrl =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
    ? process.env.NEXT_PUBLIC_SITE_URL.trim()
    : "https://hairstyleai.ai"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "AI hairstyle changer",
    "free virtual hairstyle",
    "hairstyle try on online",
    "AI hair color preview",
    "virtual haircut",
    "men women kids hairstyles",
  ],
  icons: {
    icon: [{ url: SITE_LOGO_PATH, type: "image/png" }],
    apple: [{ url: SITE_LOGO_PATH, type: "image/png" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: "AI Hairstyle Changer",
    locale: "en_US",
    type: "website",
    images: [{ url: SITE_LOGO_PATH, width: 512, height: 512, alt: "AI Hairstyle Changer logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_LOGO_PATH],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full overflow-x-hidden antialiased`}>
      <body className="min-h-full min-w-0 flex flex-col overflow-x-hidden">
        <ThemeProvider>
          <Suspense fallback={null}>
            <AuthGreetingCard />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
