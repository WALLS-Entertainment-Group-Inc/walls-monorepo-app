export default function CreativesPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <header className="border-b border-border px-6 py-6 md:px-8">
        <p className="text-sm text-muted-foreground">Assets</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Creatives</h1>
      </header>

      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <p className="text-sm text-muted-foreground">
          Creative library and uploads will land here.
        </p>
      </div>
    </main>
  );
}
