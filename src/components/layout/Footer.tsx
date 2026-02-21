import React from "react";
import Link from "next/link";
import { Github, Twitter, Instagram, Mail } from "lucide-react";
import { SwingingLogo } from "./SwingingLogo";

const FOOTER_LINKS = {
  Product: [
    { name: "Studio", href: "/studio" },
    { name: "Generate", href: "/generate" },
    { name: "Advisor", href: "/advisor" },
    { name: "Pricing", href: "/pricing" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  Legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <SwingingLogo showIcon={false} className="items-start" />
            </Link>
            <p className="text-white/50 text-base max-w-xs mb-8">
              The AI-powered virtual fitting room. Revolutionizing how people
              try and buy clothes online.
            </p>
            <div className="flex items-center gap-5">
              {[Twitter, Github, Instagram, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/40 hover:text-violet-400 transition-colors"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h4 className="text-white font-display font-semibold mb-6 uppercase tracking-wider text-sm">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-violet-400 transition-colors text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Imagify AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-white/30 text-sm flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
