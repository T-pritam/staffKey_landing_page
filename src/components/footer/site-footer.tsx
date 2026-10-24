import { appPage, STATIC_LINKS } from "@/lib/links";
import type { LandingLinks } from "@/lib/types";

import { FooterWordmark } from "./footer-wordmark";

export function SiteFooter({ links }: { links: LandingLinks }) {
  const legal = [
    { label: "Privacy", href: appPage(links, "/privacy") },
    { label: "Terms", href: appPage(links, "/terms") },
    { label: "Contact", href: `mailto:${STATIC_LINKS.email}` },
    { label: "Employer login", href: links.employerLogin },
  ];

  return (
    <footer className="defer-render relative overflow-clip bg-ink [--defer-h:760px] pt-6 pb-[max(28px,env(safe-area-inset-bottom))] text-ivory lg:pt-8">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <div className="flex flex-col gap-10 border-t border-line-dark pt-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="display text-[28px] leading-[1.05]">
              Hospitality recruitment for <em>Indian hotels.</em>
            </p>
            <a
              href={`mailto:${STATIC_LINKS.email}`}
              className="mt-5 inline-flex min-h-11 items-center font-mono text-[14px] text-on-dark-muted underline decoration-ivory/25 underline-offset-4 transition-colors hover:text-ivory hover:decoration-ivory"
            >
              {STATIC_LINKS.email}
            </a>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-1 sm:flex sm:gap-8">
              {legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="inline-flex min-h-11 items-center text-[15px] text-on-dark-muted transition-colors hover:text-ivory">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Capped so the wordmark stays in proportion with the rest of the type. */}
        <div className="mt-16 max-w-[760px] lg:mt-20">
          <FooterWordmark />
        </div>

        <div className="mt-8 flex flex-col gap-2 font-mono text-[12px] text-on-dark-faint sm:flex-row sm:justify-between">
          <p>© Staffkey. All rights reserved.</p>
          <p>Brands shown are illustrative.</p>
        </div>
      </div>
    </footer>
  );
}
