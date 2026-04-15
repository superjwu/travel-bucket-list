"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (href: string) =>
    `relative py-1 text-sm font-medium transition-colors ${
      pathname === href
        ? "text-accent"
        : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
    }`;

  const activeDot = (href: string) =>
    pathname === href
      ? "absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
      : "";

  return (
    <nav
      data-no-transition
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-surface/80 backdrop-blur-lg shadow-sm"
          : "border-border bg-surface"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <svg className="h-7 w-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="font-display text-xl font-bold tracking-tight">
              Wanderlust
            </span>
          </Link>
          <div className="hidden gap-8 sm:flex">
            <Link href="/explore" className={linkClass("/explore")}>
              Explore
              <span className={activeDot("/explore")} />
            </Link>
            <Show when="signed-in">
              <Link href="/bucket-list" className={linkClass("/bucket-list")}>
                My List
                <span className={activeDot("/bucket-list")} />
              </Link>
            </Show>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>

          <button
            className="sm:hidden rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-4 py-3 sm:hidden">
          <Link
            href="/explore"
            className="block py-2 text-sm font-medium text-stone-600 dark:text-stone-400"
            onClick={() => setMobileOpen(false)}
          >
            Explore
          </Link>
          <Show when="signed-in">
            <Link
              href="/bucket-list"
              className="block py-2 text-sm font-medium text-stone-600 dark:text-stone-400"
              onClick={() => setMobileOpen(false)}
            >
              My List
            </Link>
          </Show>
        </div>
      )}
    </nav>
  );
}
