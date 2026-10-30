import Image from "next/image";
import type { BannerMedia as BannerMediaType } from "@/lib/content";

/** Renders a banner's picture or video to fill its parent. Parent must be `relative`. */
export function BannerMedia({
  media,
  priority = false,
  sizes = "100vw",
}: {
  media: BannerMediaType;
  priority?: boolean;
  sizes?: string;
}) {
  if (media.type === "video") {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
      />
    );
  }
  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover"
    />
  );
}
