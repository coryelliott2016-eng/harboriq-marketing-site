// Web-sized variants of the real brand PNGs (originals kept alongside as source
// of truth: harboriq-logo-mark.png / harboriq-logo-full.png, regenerate with
// scripts/optimize-logos.py).
import markSrc from "@/assets/harboriq-mark-web.png";
import fullSrc from "@/assets/harboriq-lockup-web.png";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  /** Mark height in Tailwind units — nav/footer default is h-9 (36px). */
  markClassName?: string;
}

/**
 * HarborIQ shield mark (real brand PNG, transparent).
 *
 * IMPORTANT: this artwork was background-removed from a dark-navy source and
 * retains faint dark glow artifacts around the beacon. It reads correctly on
 * dark navy surfaces (nav, footer, dark heroes) ONLY. Never place it directly
 * on white/light backgrounds — use <LogoTile> to wrap it in a dark tile instead.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={markSrc}
      alt=""
      aria-hidden="true"
      width={512}
      height={512}
      className={className ?? "h-9 w-auto shrink-0"}
      draggable={false}
    />
  );
}

/**
 * Dark rounded tile wrapper — the only safe way to show the mark on a light
 * section, because it gives the glow artifacts a navy backdrop to sit on.
 */
export function LogoTile({
  className,
  markClassName = "h-8 w-auto",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-brand-900 p-2.5 ${className ?? ""}`}
      role="img"
      aria-label="HarborIQ"
    >
      <LogoMark className={markClassName} />
    </span>
  );
}

/** Full lockup PNG (mark + HARBOR IQ wordmark). Dark surfaces only. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <img
      src={fullSrc}
      alt="HarborIQ"
      width={1024}
      height={512}
      className={className ?? "h-16 w-auto"}
      draggable={false}
    />
  );
}

export function Logo({ className, showWordmark = true, markClassName }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`} aria-label="HarborIQ">
      <LogoMark className={markClassName ?? "h-9 w-auto shrink-0"} />
      {showWordmark && (
        <span className="font-display font-bold text-lg tracking-tight text-foreground">
          Harbor<span className="text-amber-500">IQ</span>
        </span>
      )}
    </span>
  );
}
