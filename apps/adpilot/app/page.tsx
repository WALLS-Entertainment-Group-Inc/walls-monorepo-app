const stats = [
  { label: "Active campaigns", value: "—" },
  { label: "Spend (MTD)", value: "—" },
  { label: "CTR", value: "—" },
  { label: "Conversions", value: "—" },
];

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <header className="border-b border-border px-6 py-6 md:px-8">
        <p className="text-sm text-muted-foreground">Overview</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Dashboard</h1>
      </header>

      <div className="flex flex-1 flex-col gap-8 bg-background p-6 md:p-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="flex flex-1 flex-col rounded-xl border border-dashed border-border bg-card p-8">
          <h2 className="text-lg font-medium text-foreground">Ready to build</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            AdPilot is wired into the WALLS monorepo with Supabase and root{" "}
            <code className="rounded bg-accent px-1.5 py-0.5 text-foreground">
              .env
            </code>
            . Paste flows from your live app here — campaigns, creatives, and
            reporting will slot into this shell.
          </p>
        </section>
      </div>
    </main>
  );
}
