import { Skeleton } from "@/components/ui/skeleton";

export default function GenerateLoading() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 max-w-6xl mx-auto space-y-12">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-8 w-48 rounded-full bg-zinc-900" />
        <Skeleton className="h-12 w-96 bg-zinc-900" />
        <Skeleton className="h-6 w-125 bg-zinc-900" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-14 w-100 rounded-2xl bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Column Skeleton */}
        <div className="lg:col-span-6 space-y-8">
          <Skeleton className="h-64 w-full rounded-[32px] bg-zinc-900" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full bg-zinc-900" />
            <Skeleton className="h-8 w-32 rounded-full bg-zinc-900" />
            <Skeleton className="h-8 w-28 rounded-full bg-zinc-900" />
          </div>
          <Skeleton className="h-16 w-full rounded-2xl bg-zinc-900" />
        </div>

        {/* Result Column Skeleton */}
        <div className="lg:col-span-6">
          <Skeleton className="aspect-4/5 rounded-[40px] bg-zinc-900" />
        </div>
      </div>
    </main>
  );
}
