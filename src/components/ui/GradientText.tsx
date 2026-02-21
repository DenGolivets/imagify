import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string; // e.g. "from-violet-500"
  to?: string; // e.g. "to-fuchsia-500"
}

export function GradientText({
  children,
  className,
  from = "from-violet-500",
  to = "to-fuchsia-500",
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        to,
        className,
      )}
    >
      {children}
    </span>
  );
}
