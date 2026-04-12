import Image from "next/image"
import Link from "next/link"
import { SITE_LOGO_PATH, SITE_SHORT_NAME } from "@/lib/site"

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
]

const productLinks = [
  { label: "What it is", href: "#what-is" },
  { label: "AI Nail Art", href: "/nail-art" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Try on", href: "/try-on" },
  { label: "Top styles", href: "#styles-2026" },
]

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="min-w-0 overflow-x-clip border-t border-border bg-background">
      <div className="mx-auto min-w-0 max-w-7xl px-3 py-10 sm:px-4 sm:py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex w-fit items-center gap-2">
              <span className="relative size-9 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src={SITE_LOGO_PATH}
                  alt={SITE_SHORT_NAME}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </span>
              <span className="text-base font-semibold">{SITE_SHORT_NAME}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Preview 150+ AI hairstyles and colours before the salon—free virtual hairstyle try-on in your browser.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-secondary hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            {productLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <Link
              href="#faq"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
            <a
              href="mailto:support@hairstyleai.ai"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              support@hairstyleai.ai
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 {SITE_SHORT_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
