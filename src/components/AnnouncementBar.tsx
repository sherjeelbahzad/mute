import Link from "next/link";
import { announcement } from "@/lib/content";

export function AnnouncementBar() {
  if (!announcement.text) return null;
  const inner = <span className="text-xs tracking-wide sm:text-sm">{announcement.text}</span>;
  return (
    <div className="bg-ink text-center text-mint">
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
        {announcement.href ? (
          <Link href={announcement.href} className="hover:opacity-80">
            {inner}
          </Link>
        ) : (
          inner
        )}
      </div>
    </div>
  );
}
