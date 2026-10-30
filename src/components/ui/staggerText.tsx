"use client";

import { motion } from "motion/react";

/**
 * Stagger Text, from Vengeance UI (https://www.vengenceui.com/components/stagger-text, MIT).
 * Words or letters rise into place one after another the first time the text scrolls into view.
 * Adapted: imports `motion/react`, plain-text children only.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const container = (stagger: number, delay: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const item = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.6, ease: EASE } },
};

export default function StaggerText({
  children,
  delay = 0,
  divideBy = "word",
}: {
  children: string;
  delay?: number;
  divideBy?: "word" | "letter";
}) {
  const parts = divideBy === "letter" ? children.split("") : children.split(" ");
  const stagger = divideBy === "letter" ? 0.02 : 0.05;

  return (
    <motion.span
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="inline-block"
    >
      {parts.map((part, i) => (
        <span key={i} className="relative inline-block overflow-hidden align-top">
          <motion.span variants={item} className="inline-block will-change-transform">
            {divideBy === "letter" ? (part === " " ? " " : part) : part + " "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
