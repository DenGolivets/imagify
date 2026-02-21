import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Imagify",
  description: "Reset your Imagify account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
