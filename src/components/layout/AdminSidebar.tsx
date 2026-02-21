"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ImageIcon,
  BarChart3,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SwingingLogo } from "./SwingingLogo";

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Generations", href: "/admin/generations", icon: ImageIcon },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-background/50 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <Link href="/">
          <SwingingLogo />
        </Link>
        <div className="mt-4 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 w-fit">
          <ShieldCheck className="size-3.5 text-violet-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {ADMIN_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                  : "text-white/50 hover:bg-white/5 hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon
                  className={cn(
                    "size-5 transition-colors",
                    isActive
                      ? "text-violet-400"
                      : "text-white/40 group-hover:text-white/70",
                  )}
                />
                <span className="font-medium">{link.name}</span>
              </div>
              {isActive && <ChevronRight className="size-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/50 hover:text-red-400 hover:bg-red-400/10 h-12 rounded-xl"
        >
          <LogOut className="size-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
