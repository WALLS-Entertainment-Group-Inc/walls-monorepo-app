import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/creatives", label: "Creatives" },
  { href: "/reports", label: "Reports" },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="border-b border-border px-6 py-5">
        <Link href="/" className="block">
          <span className="text-xs tracking-[0.3em] text-muted-foreground">
            WALLS
          </span>
          <span className="mt-1 block text-lg font-semibold text-foreground">
            AdPilot
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          Internal tool · WALLS Entertainment
        </p>
      </div>
    </aside>
  );
}
