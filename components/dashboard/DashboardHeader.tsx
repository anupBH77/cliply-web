import { Search } from "lucide-react";

export default function DashboardHeader({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  return (
    <div className="border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 transition-colors bg-white dark:from-zinc-900  dark:to-zinc-950 dark:bg-gradient-to-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <div className="relative max-w-md w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:ring-zinc-100 transition-all bg-gray-50 dark:from-zinc-900  dark:to-zinc-950 dark:bg-gradient-to-r text-gray-900 focus:bg-white dark:bg-gray-800 dark:border-zinc-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

    </div>
  );
}
