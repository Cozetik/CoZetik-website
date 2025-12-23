"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type TransitionPhase = "idle" | "entering" | "waiting" | "exiting";

// SYNCHRONISATION : 800ms pour correspondre au CSS (0.8s)
const ENTER_DURATION_MS = 800;
const EXIT_DURATION_MS = 800;
const MAX_WAIT_READY_MS = 4000;

export function PageTransitionOverlay(): React.ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const lastPathRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pendingHrefRef = useRef<string | null>(null);
  const waitingForReadyRef = useRef<boolean>(false);
  const waitTimeoutRef = useRef<number | null>(null);

  // Ensure first render doesn't animate
  useEffect(() => {
    setIsMounted(true);
    lastPathRef.current = pathname;
  }, []);

  // Listen to manual transition start events (pre-navigation) with target href
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ href: string }>;
      const href = custom.detail?.href;
      if (!href) return;

      let targetPath = href;
      try {
        targetPath = new URL(href, window.location.origin).pathname;
      } catch {}
      const normalize = (p: string) =>
        p.split("?")[0].split("#")[0].replace(/\/?$/, "");
      const currentLocationPath =
        typeof window !== "undefined" ? window.location.pathname : pathname;
      const current = normalize(currentLocationPath);
      const target = normalize(targetPath);

      // Start entering
      setPhase("entering");

      if (current === target) {
        // Same page: animate in then out
        pendingHrefRef.current = null;
        waitingForReadyRef.current = false;
        if (waitTimeoutRef.current) {
          window.clearTimeout(waitTimeoutRef.current);
          waitTimeoutRef.current = null;
        }
        const t1 = window.setTimeout(() => {
          setPhase("exiting");
          const t2 = window.setTimeout(() => {
            setPhase("idle");
          }, EXIT_DURATION_MS);
          return () => window.clearTimeout(t2);
        }, ENTER_DURATION_MS);
        return () => window.clearTimeout(t1);
      }

      // Different route: wait for animation to finish BEFORE pushing router
      pendingHrefRef.current = href;
      window.setTimeout(() => {
        if (pendingHrefRef.current) {
          waitingForReadyRef.current = true;
          router.push(pendingHrefRef.current);
        }
      }, ENTER_DURATION_MS);
    };
    window.addEventListener(
      "page-transition-navigate",
      handler as EventListener
    );
    return () =>
      window.removeEventListener(
        "page-transition-navigate",
        handler as EventListener
      );
  }, []);

  // When the pathname changes (navigation happened), wait for ready signal
  useEffect(() => {
    if (!isMounted) return;
    if (lastPathRef.current !== null && lastPathRef.current !== pathname) {
      setPhase("waiting");

      if (waitTimeoutRef.current) {
        window.clearTimeout(waitTimeoutRef.current);
      }
      // Safety timeout
      waitTimeoutRef.current = window.setTimeout(() => {
        if (waitingForReadyRef.current) {
          waitingForReadyRef.current = false;
          setPhase("exiting");
          const t = window.setTimeout(() => {
            setPhase("idle");
            pendingHrefRef.current = null;
          }, EXIT_DURATION_MS);
          return () => window.clearTimeout(t);
        }
      }, MAX_WAIT_READY_MS);
    }
    lastPathRef.current = pathname;
  }, [pathname, isMounted]);

  // Listen for ready signal
  useEffect(() => {
    const onReady = () => {
      if (!waitingForReadyRef.current) return;
      waitingForReadyRef.current = false;
      if (waitTimeoutRef.current) {
        window.clearTimeout(waitTimeoutRef.current);
        waitTimeoutRef.current = null;
      }
      setPhase("exiting");
      const t = window.setTimeout(() => {
        setPhase("idle");
        pendingHrefRef.current = null;
      }, EXIT_DURATION_MS);
      return () => window.clearTimeout(t);
    };
    window.addEventListener("page-transition-ready", onReady);
    return () => window.removeEventListener("page-transition-ready", onReady);
  }, []);

  const isVisible = phase !== "idle";

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none fixed inset-0 z-[9999] transition-none",
        isVisible ? "block" : "hidden",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-y-0 right-0 w-full bg-gradient-to-br from-[#ada6db] to-[#262626] overlay-pane",
          phase === "entering" ? "overlay-slide-in" : "",
          phase === "exiting" ? "overlay-slide-out" : "",
          // Force full opacity/position during waiting phase to prevent glitches
          phase === "waiting" ? "translate-x-0" : "",
        ].join(" ")}
      />
    </div>
  );
}
