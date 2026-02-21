import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      plan: "free" | "pro";
    } & DefaultSession["user"];
  }

  interface User {
    role: "user" | "admin";
    plan: "free" | "pro";
  }
}
import "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    role: "user" | "admin";
    plan: "free" | "pro";
  }
}
