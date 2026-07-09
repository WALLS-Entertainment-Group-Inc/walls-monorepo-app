import { Suspense } from "react";

import WalliePage from "@/wallie";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WalliePage />
    </Suspense>
  );
}
