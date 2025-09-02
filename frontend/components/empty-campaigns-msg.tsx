import { InboxIcon } from "lucide-react";

export default function EmptyCampaignsMsg() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
      <InboxIcon className="w-12 h-12 mb-4 text-gray-400" />
      <h2 className="text-lg font-semibold">No campaigns found</h2>
      <p className="text-sm mt-1">You haven’t created or joined any campaigns yet.</p>
    </div>
  );
}
