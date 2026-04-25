"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z" />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ExploreIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function HealthIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

const tabs = [
  { label: "Bookmarked",       href: "/bookmarked",       Icon: BookmarkIcon },
  { label: "Home",             href: "/",                 Icon: HomeIcon },
  { label: "Health Resources", href: "/health-resources", Icon: HealthIcon },
  { label: "Explore",          href: "/explore",          Icon: ExploreIcon },
] as const;

function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = session?.user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 hover:ring-2 hover:ring-green-400 transition focus:outline-none"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-sm font-semibold text-gray-500">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
          >
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Settings
          </Link>
          <hr className="my-1 border-gray-100" />
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-b-xl"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop — top bar */}
      <nav className="hidden md:flex fixed top-0 inset-x-0 h-14 bg-white border-b border-gray-100 z-50 items-center">
        <div className="max-w-5xl mx-auto w-full flex items-center gap-8 px-8">
          <Link href="/" className="flex items-center gap-0 shrink-0 hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="RootKitchen logo" className="w-20 h-20 object-contain" />
            <span className="text-green-700 font-bold text-lg">RootKitchen</span>
          </Link>

          <div className="flex flex-1 justify-center gap-8">
            {tabs.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-semibold transition-colors border-b-2 pb-0.5 whitespace-nowrap ${
                    active
                      ? "text-green-700 border-green-600"
                      : "text-gray-500 border-transparent hover:text-gray-800"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <UserMenu />
        </div>
      </nav>

      {/* Mobile — top bar (logo + user bubble) */}
      <header className="md:hidden fixed top-0 inset-x-0 h-12 bg-white border-b border-gray-100 z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="RootKitchen logo" className="w-20 h-20 object-contain" />
          <span className="text-green-700 font-bold text-base">RootKitchen</span>
        </Link>
        <UserMenu />
      </header>

      {/* Mobile — bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-50 flex h-16">
        {tabs.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "text-green-700" : "text-gray-400"
              }`}
            >
              <Icon active={active} />
              <span className="text-[9px] font-medium leading-tight text-center">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
