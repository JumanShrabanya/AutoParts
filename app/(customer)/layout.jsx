"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/context/userSession";
import Navigation from "@/components/Navbar/Navigation";
import Footer from "@/components/Footer/Footer";

export default function CustomerLayout({ children }) {
  const { authenticated, loading } = useUserSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/auth");
    }
  }, [loading, authenticated, router]);

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
