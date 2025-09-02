import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border p-4 shadow-sm space-y-4"
        >
          {/* Header: Title + Date */}
          <div className="flex justify-between items-center">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-28 h-4" />
          </div>

          {/* Description */}
          <Skeleton className="w-40 h-4" />

          {/* Progress Bar */}
          <Skeleton className="w-full h-2 rounded-full" />

          {/* Deadline Label */}
          <Skeleton className="w-40 h-4" />

          {/* View Button */}
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      ))}
    </div>
  );
}
