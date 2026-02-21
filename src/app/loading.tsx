export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="relative h-20 w-20">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        {/* Inner spinning circle */}
        <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-tr from-primary to-secondary" />
        {/* Center dot */}
        <div className="absolute inset-8 rounded-full bg-background" />
      </div>
      <p className="mt-6 animate-pulse font-display text-lg font-medium text-gradient">
        Working magic...
      </p>
    </div>
  );
}
