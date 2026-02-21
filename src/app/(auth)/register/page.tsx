import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register | Imagify",
  description:
    "Create an account to start using the Imagify AI fashion studio.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
