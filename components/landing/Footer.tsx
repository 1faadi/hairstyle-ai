import Link from "next/link"
import { Sparkles } from "lucide-react"

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Email", href: "mailto:support@hairstyleai.ai" },
]

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-base text-foreground">Hairstyle AI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The most advanced AI hairstyle try-on tool. Preview 500+ styles instantly — no risk, no regret.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-semibold"
                >
                  {label.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            {["Pricing", "AI Hair Styles", "AI Photo", "AI Video", "AI Portrait", "VIP"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            {["Contact Us", "FAQ", "Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                {item}
              </a>
            ))}
            <a
              href="mailto:support@hairstyleai.ai"
              className="text-sm text-primary hover:underline w-fit mt-1"
            >
              support@hairstyleai.ai
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Hairstyle AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
