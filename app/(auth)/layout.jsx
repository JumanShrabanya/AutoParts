"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/context/userSession";

export default function AuthLayout({ children }) {
  const { authenticated, loading } = useUserSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      router.replace("/");
    }
  }, [loading, authenticated, router]);

  if (authenticated) return null;

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
