"use client";

import { useState, useTransition } from "react";
import { addToBucketList } from "@/app/actions/bucket-list";

interface AddToBucketListProps {
  countryCode: string;
  countryName: string;
  flagUrl: string;
  region: string;
  isSaved: boolean;
}

export function AddToBucketList({
  countryCode,
  countryName,
  flagUrl,
  region,
  isSaved: initialSaved,
}: AddToBucketListProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  if (saved) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        In Bucket List
      </div>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await addToBucketList({
            country_code: countryCode,
            country_name: countryName,
            flag_url: flagUrl,
            region,
          });
          if (result.success) {
            setSaved(true);
          }
        });
      }}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
    >
      {isPending ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      )}
      Add to Bucket List
    </button>
  );
}
