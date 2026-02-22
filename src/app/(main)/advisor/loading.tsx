import { Skeleton } from "@/components/ui/skeleton";

export default function AdvisorLoading() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-8 w-48 rounded-full bg-zinc-900" />
        <Skeleton className="h-16 w-96 bg-zinc-900" />
        <Skeleton className="h-4 w-125 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Main Card Skeleton */}
          <Skeleton className="h-150 w-full rounded-[40px] bg-zinc-900" />

          {/* Chat Bar Skeleton */}
          <Skeleton className="h-20 w-full rounded-full bg-zinc-900" />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Skeleton className="h-6 w-32 bg-zinc-900" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-24 w-full rounded-2xl bg-zinc-900"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
