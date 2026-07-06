import { Suspense } from "react";

import { SettingsPage } from "@/components/settings/settings-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-full bg-walls-white px-6 py-8 md:pl-24 md:pr-10">
          <p className="text-sm font-light text-neutral-500">Loading settings…</p>
        </main>
      }
    >
      <SettingsPage />
    </Suspense>
  );
}
