"use client";

import { useState, useTransition } from "react";
import { updateBucketListItem } from "@/app/actions/bucket-list";
import { StarRating } from "./StarRating";
import type { BucketListItem } from "@/lib/types";

interface EditItemModalProps {
  item: BucketListItem;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditItemModal({ item, onClose, onUpdated }: EditItemModalProps) {
  const [notes, setNotes] = useState(item.notes ?? "");
  const [visited, setVisited] = useState(item.visited);
  const [priority, setPriority] = useState(item.priority);
  const [travelDate, setTravelDate] = useState(item.travel_date ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateBucketListItem(item.id, {
        notes: notes || null,
        visited,
        priority,
        travel_date: travelDate || null,
      });
      onUpdated();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Edit: {item.country_name}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Visited toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Status
            </label>
            <button
              onClick={() => setVisited(!visited)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                visited ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  visited ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            {visited ? "Visited" : "Want to Visit"}
          </p>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Priority
            </label>
            <div className="mt-1">
              <StarRating value={priority} onChange={setPriority} />
            </div>
          </div>

          {/* Travel Date */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Write your thoughts about this destination..."
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
