import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/studio",
  "/generate",
  "/advisor",
  "/wardrobe",
  "/profile",
];
const ADMIN_ROUTES = ["/admin"];
const GUEST_ONLY_ROUTES = ["/login", "/register", "/forgot-password"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute =
    ADMIN_ROUTES.some((route) => pathname.startsWith(route)) &&
    pathname !== "/admin/login";
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);

  // Admin protection
  if (isAdminRoute) {
    if (!session || session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  // General protection
  if (isProtectedRoute) {
    if (!session) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Logged-in users shouldn't access login/register
  if (isGuestOnlyRoute && session) {
    return NextResponse.redirect(new URL("/studio", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
