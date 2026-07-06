export default function CampaignsPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <header className="border-b border-border px-6 py-6 md:px-8">
        <p className="text-sm text-muted-foreground">Manage</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Campaigns</h1>
      </header>

      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <p className="text-sm text-muted-foreground">
          Campaign views will be added as you migrate from the live app.
        </p>
      </div>
    </main>
  );
}
