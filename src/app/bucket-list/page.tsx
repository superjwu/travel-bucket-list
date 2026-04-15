import { getBucketList } from "@/app/actions/bucket-list";
import { BucketListClient } from "./BucketListClient";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "My Bucket List | Travel Bucket List",
  description: "Your personal travel bucket list",
};

export default async function BucketListPage() {
  const items = await getBucketList();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          My Bucket List
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Track the countries you want to visit and the ones you have already explored.
        </p>
      </div>

      {items.length === 0 ? <EmptyState /> : <BucketListClient items={items} />}
    </div>
  );
}
