/**
 * Shared scroll and pointer state for scroll-driven visuals.
 * Written by passive window listeners, read every frame by the WebGL scene.
 * Plain mutable object (not React state) so reads never trigger re-renders.
 */
export const motionState = {
  /** window.scrollY in px */
  y: 0,
  /** 0 at top of page, 1 at the bottom */
  progress: 0,
  /** px scrolled since the last frame consumed it (scene resets it) */
  velocity: 0,
  /** pointer in [-1, 1] with +y up */
  pointerX: 0,
  pointerY: 0,
};

let bound = false;

export function bindMotion() {
  if (bound || typeof window === "undefined") return;
  bound = true;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    motionState.velocity += y - motionState.y;
    motionState.y = y;
    motionState.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
  };
  const onPointer = (e: PointerEvent) => {
    motionState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    motionState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("pointermove", onPointer, { passive: true });
  onScroll();
}
