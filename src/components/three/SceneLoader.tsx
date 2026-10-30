"use client";

import dynamic from "next/dynamic";
import { Component, useSyncExternalStore, type ReactNode } from "react";

// The WebGL scene is client-only: no SSR, loaded in its own chunk after the page is interactive.
const ScrollScene = dynamic(() => import("./ScrollScene").then((m) => m.ScrollScene), { ssr: false });

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** If WebGL fails for any reason the site must still work: swallow the error and render nothing. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SceneLoader() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <SceneBoundary>
        <ScrollScene />
      </SceneBoundary>
    </div>
  );
}
