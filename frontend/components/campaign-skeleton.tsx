import { Skeleton } from "@/components/ui/skeleton"

export default function CampaignSkeleton() {
  return (
    <div className="max-w-xl mx-auto my-4">
      {/* Balance */}
      <div className="flex justify-center">
        <Skeleton className="w-16 h-8 rounded-md" />
      </div>

      {/* Campaign Name & Active Switch */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="w-32 h-4 mb-1" />
          <Skeleton className="w-48 h-4 mb-1" />
        </div>
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>

      {/* Progress Bar */}
      <div>
        <Skeleton className="h-2 w-full rounded-full mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <Skeleton className="w-20 h-4 mb-2" />
          <Skeleton className="w-8 h-4" />
        </div>
      </div>

      {/* Goals and Deadline */}
      <div className="space-y-2 text-sm">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-60 h-4" />
      </div>

      {/* Tiers Grid (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="p-4 border rounded-xl space-y-3 flex flex-col items-center"
          >
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-full h-8 rounded-md" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
