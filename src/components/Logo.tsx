import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`} aria-label="Mute home">
      <Image
        src="/brand/logo.png"
        alt=""
        width={30}
        height={32}
        priority
        className="h-8 w-auto transition-transform duration-500 group-hover:rotate-[-8deg]"
      />
      <span className="font-display text-lg font-bold lowercase tracking-tight">mute</span>
    </Link>
  );
}
