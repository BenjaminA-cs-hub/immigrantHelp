"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <NavBar />}
      <div className={!isAuthPage ? "pt-12 md:pt-14 pb-16 md:pb-0" : ""}>
        {children}
      </div>
    </>
  );
}
