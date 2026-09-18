"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CursorLockup } from "@/components/brand";
import { CAMPAIGN, PRODUCT_NAME } from "@/lib/seed";
import { assetStatus, STATUS_LABEL, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/research", label: "Research" },
  { href: "/keywords", label: "Keywords" },
  { href: "/creatives", label: "Creatives" },
  { href: "/action", label: "Review & export" },
] as const;

function Toaster() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-3 text-sm shadow-xl"
    >
      {toast}
    </div>
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href === "/research" && pathname === "/");

  return (
    <div className="flex min-h-full">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border px-4 py-6 lg:flex">
        <Link href="/research" className="mb-9 block px-2">
          <CursorLockup height={20} tone="light" priority className="h-5 w-auto" />
          <p className="mt-2.5 text-[13px] font-medium leading-tight text-muted-foreground">
            {PRODUCT_NAME}
          </p>
        </Link>

        <nav className="flex-1">
          <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="px-3 text-xs leading-5 text-muted-foreground">
          {CAMPAIGN.name}
          <br />
          {CAMPAIGN.network} · {CAMPAIGN.geo}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-5 py-3 backdrop-blur lg:hidden">
          <Link href="/research" className="flex min-w-0 items-center gap-3">
            <CursorLockup height={18} tone="light" className="h-[18px] w-auto" />
            <p className="truncate text-[13px] font-medium text-muted-foreground">{PRODUCT_NAME}</p>
          </Link>
          <nav className="ml-auto overflow-x-auto">
            <ul className="flex gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-1.5 text-sm",
                      isActive(item.href)
                        ? "bg-foreground text-background"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}

export function Page({
  title,
  lede,
  actions,
  children,
  wide,
}: {
  title: string;
  lede?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn("mx-auto px-6 py-10 sm:px-10 sm:py-12", wide ? "max-w-[1360px]" : "max-w-4xl")}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
          {lede ? (
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted-foreground">{lede}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function StatusBadge({ assetKey }: { assetKey: string }) {
  const { state } = useStore();
  const status = assetStatus(state, assetKey);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        status === "approved" ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "approved" ? "bg-background" : "bg-muted-foreground",
        )}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** The one action that moves the campaign forward from this page. */
export function NextStep({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}
