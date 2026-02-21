"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LoginInput } from "@/lib/validations/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (values: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      // result can be undefined or contain error
      if (result && "error" in result && result.error) {
        toast.error("Invalid credentials. Please try again.");
        return { success: false, error: result.error };
      }

      toast.success("Welcome back!");
      router.push("/studio");
      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/studio" });
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error("Google authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    logout,
    isLoading,
  };
}
