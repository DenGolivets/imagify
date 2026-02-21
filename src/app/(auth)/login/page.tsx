import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Imagify",
  description:
    "Sign in to your Imagify account to access the AI fashion studio.",
};

export default function LoginPage() {
  return <LoginForm />;
}
