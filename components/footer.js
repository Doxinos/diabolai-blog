import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Services: [
    { label: "Voice Agents", href: "https://www.diabolai.com" },
    { label: "AI Content", href: "https://www.diabolai.com" },
    { label: "AI Avatars", href: "https://www.diabolai.com" },
  ],
  Company: [
    { label: "About", href: "https://www.diabolai.com" },
    { label: "Contact", href: "https://www.diabolai.com" },
    { label: "Book a Call", href: "https://www.diabolai.com" },
  ],
  Blog: [
    { label: "All Posts", href: "/" },
    { label: "AI Voice Agents", href: "/category/ai-voice-agents" },
    { label: "AI for Business", href: "/category/ai-for-business" },
  ],
};

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/diabolai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/diabolai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-oxford">
      <div className="max-w-screen-xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <Link href="https://www.diabolai.com">
              <Image
                src="/img/diabol-logo-white.png"
                width={130}
                height={26}
                alt="Diabol AI"
              />
            </Link>
            <p className="mt-4 text-sm text-white/60 font-display">
              AI solutions for businesses that want to move fast.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-orange transition-colors"
                  aria-label={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(!link.href.startsWith("/") && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      className="text-white/70 text-sm font-display hover:text-orange transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Diabol AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
