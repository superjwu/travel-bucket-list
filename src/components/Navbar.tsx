"use client";

import Link from "next/link";
import {
  SignInButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            🌍 Travel Bucket List
          </Link>
          <div className="hidden gap-6 sm:flex">
            <Link
              href="/explore"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Explore
            </Link>
            <Show when="signed-in">
              <Link
                href="/bucket-list"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                My Bucket List
              </Link>
            </Show>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>

          {/* Mobile menu button */}
          <button
            className="sm:hidden rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-200 px-4 py-3 sm:hidden dark:border-zinc-800">
          <Link
            href="/explore"
            className="block py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
            onClick={() => setMobileOpen(false)}
          >
            Explore
          </Link>
          <Show when="signed-in">
            <Link
              href="/bucket-list"
              className="block py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
              onClick={() => setMobileOpen(false)}
            >
              My Bucket List
            </Link>
          </Show>
        </div>
      )}
    </nav>
  );
}
