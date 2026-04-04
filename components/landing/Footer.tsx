import Link from "next/link"
import { Scissors } from "lucide-react"

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
]

const productLinks = [
  { label: "AI Hair", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Try On", href: "/try-on" },
  { label: "Pricing", href: "#pricing" },
]

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex w-fit items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                <Scissors className="size-4" />
              </div>
              <span className="text-base font-semibold">AI Hair</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI hairstyle previews designed to help you choose your next look with confidence.
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
          <p className="text-xs text-muted-foreground">© 2026 AI Hair. All rights reserved.</p>
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
