"use client";

import { useSyncExternalStore, type ComponentProps } from "react";

import type { LandingLinks } from "@/lib/types";

type Platform = "android" | "ios" | "desktop";

function detect(): Platform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return "desktop";
}

const subscribe = () => () => {};

/**
 * Where a candidate button goes on this device:
 *
 *   Android  the Play Store listing, if set
 *   iOS      the App Store listing, if set
 *   phones   then the app download page, if set
 *   always   candidate web (/login/candidate) otherwise, and on desktop
 *
 * The store and download addresses are admin settings and are empty until the
 * apps are listed, so today every device gets candidate web. Server-rendered
 * as candidate web, so the link works before (and without) JavaScript.
 */
export function candidateHref(links: LandingLinks, platform: Platform): string {
  if (platform === "android" && links.playStore) return links.playStore;
  if (platform === "ios" && links.appStore) return links.appStore;
  if (platform !== "desktop" && links.candidateDownload) return links.candidateDownload;
  return links.candidateWeb;
}

export function CandidateLink({ links, ...props }: { links: LandingLinks } & Omit<ComponentProps<"a">, "href">) {
  const platform = useSyncExternalStore<Platform>(subscribe, detect, () => "desktop");
  return <a {...props} href={candidateHref(links, platform)} data-platform={platform} />;
}
