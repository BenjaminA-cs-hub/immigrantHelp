import { Suspense } from "react";
import SubstitutePage from "./SubstitutePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-green-600 animate-pulse">Loading...</div>}>
      <SubstitutePage />
    </Suspense>
  );
}