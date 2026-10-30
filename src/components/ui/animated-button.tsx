"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Animated Button, from Vengeance UI (https://www.vengenceui.com/components/my-animated-button, MIT).
 * A light sweep crosses the label and the rim every couple of seconds; springs on hover and press.
 * Adapted to the Mute mint pill and the `motion/react` import.
 */
export default function AnimatedButton({
  children,
  className,
  ...rest
}: Omit<HTMLMotionProps<"button">, "children"> & { children: ReactNode }) {
  return (
    <motion.button
      {...rest}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-mint font-display text-sm font-bold text-ink transition-colors hover:bg-mint-deep hover:text-paper disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {/* Label with a sweeping light mask */}
      <motion.span
        className="relative z-10 flex h-full w-full items-center justify-center"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
        initial={{ "--mask-x": "100%" } as Record<string, string>}
        animate={{ "--mask-x": "-100%" } as Record<string, string>}
        transition={{ repeat: Infinity, duration: 1, ease: "linear", repeatDelay: 2 }}
      >
        {children}
      </motion.span>
      {/* Rim shine */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full p-px"
        style={{
          background: "linear-gradient(-75deg, transparent 30%, rgba(15,22,19,0.5) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={{ backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
    </motion.button>
  );
}
