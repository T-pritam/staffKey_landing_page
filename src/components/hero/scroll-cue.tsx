"use client";

import { ChevronDown } from "lucide-react";
import type { MouseEvent } from "react";

import { scrollToTarget } from "@/lib/motion";

/** "There is more below": a small pulsing chevron that scrolls to the next section. */
export function ScrollCue({ target, label }: { target: string; label: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToTarget(target);
  };
  return (
    <a
      href={target}
      onClick={onClick}
      aria-label={label}
      className="scroll-cue group/cue inline-flex size-11 items-center justify-center rounded-full text-on-dark-muted ring-1 ring-line-dark transition-colors hover:text-ivory hover:ring-ivory/40"
    >
      <ChevronDown className="scroll-cue-icon size-5" aria-hidden />
    </a>
  );
}
