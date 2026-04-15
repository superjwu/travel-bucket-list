"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  updateBucketListItem,
  removeBucketListItem,
} from "@/app/actions/bucket-list";
import { StarRating } from "./StarRating";
import { EditItemModal } from "./EditItemModal";
import type { BucketListItem } from "@/lib/types";

interface BucketListCardProps {
  item: BucketListItem;
  onRemoved: () => void;
}

export function BucketListCard({ item, onRemoved }: BucketListCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggleVisited() {
    startTransition(async () => {
      await updateBucketListItem(item.id, { visited: !item.visited });
    });
  }

  function handlePriorityChange(priority: number) {
    startTransition(async () => {
      await updateBucketListItem(item.id, { priority });
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await removeBucketListItem(item.id);
      onRemoved();
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <Link href={`/country/${item.country_code}`} className="block">
          <div className="relative aspect-[3/2] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            {item.flag_url && (
              <Image
                src={item.flag_url}
                alt={`Flag of ${item.country_name}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            <div
              className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                item.visited ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              {item.visited ? "Visited" : "Want to Visit"}
            </div>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {item.country_name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {item.region}
              </p>
            </div>
            <StarRating
              value={item.priority}
              onChange={handlePriorityChange}
              size="sm"
            />
          </div>

          {item.travel_date && (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              📅 {new Date(item.travel_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {item.notes && (
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {item.notes}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleToggleVisited}
              disabled={isPending}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                item.visited
                  ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
              }`}
            >
              {item.visited ? "Mark as Want to Visit" : "Mark as Visited"}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              title="Edit"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="rounded-lg bg-red-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title="Remove"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <EditItemModal
          item={item}
          onClose={() => setEditing(false)}
          onUpdated={() => {}}
        />
      )}
    </>
  );
}
