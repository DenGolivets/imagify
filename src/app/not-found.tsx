import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-display mb-2 text-6xl font-black text-gradient sm:text-8xl">
        404
      </h1>
      <h2 className="text-display mb-6 text-2xl font-bold text-foreground sm:text-3xl">
        Look not found
      </h2>
      <p className="mb-8 max-w-md text-secondary-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to the style studio.
      </p>
      <Button asChild size="lg" className="rounded-full px-8">
        <Link href="/">Back to Home</Link>
      </Button>

      {/* Background glow effect */}
      <div className="bg-hero-glow pointer-events-none absolute inset-0 -z-10" />
    </div>
  );
}
