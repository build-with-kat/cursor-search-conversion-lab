import Image from "next/image";
import { ICON_DARK, LOCKUP_DARK, LOCKUP_LIGHT, type BrandAsset } from "@/lib/brand";

/**
 * Width is always derived from the requested height and the file's native ratio. The brand rules
 * forbid stretching, so the call sites are given one dimension to set rather than two.
 */
function Mark({
  asset,
  height,
  className,
  alt,
  priority,
}: {
  asset: BrandAsset;
  height: number;
  className?: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={asset.src}
      alt={alt}
      height={height}
      width={Math.round((asset.width / asset.height) * height)}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}

export function CursorLockup({
  height = 20,
  tone = "dark",
  className,
  priority,
}: {
  height?: number;
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Mark
      asset={tone === "light" ? LOCKUP_LIGHT : LOCKUP_DARK}
      height={height}
      className={className}
      alt="Cursor"
      priority={priority}
    />
  );
}

export function CursorIcon({ height = 16, className }: { height?: number; className?: string }) {
  return <Mark asset={ICON_DARK} height={height} className={className} alt="" />;
}
