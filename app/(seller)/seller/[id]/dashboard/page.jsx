"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserSession } from "@/context/userSession";
import { useSellerProfile } from "@/hooks/useSellerProfile";

const StatCard = ({ label, value, hint }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 16,
      background: "#ffffff",
    }}
  >
    <div style={{ color: "#6b7280", fontSize: 12 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{value}</div>
    {hint ? (
      <div style={{ color: "#10b981", fontSize: 12, marginTop: 4 }}>{hint}</div>
    ) : null}
  </div>
);

export default function SellerDashboardPage() {
  const { user, authenticated, loading } = useUserSession();
  const params = useParams();
  const router = useRouter();
  const { sellerProfile, loading: profileLoading, error: profileError,sessionLoading } = useSellerProfile(user?.sellerId);

  const sellerId = useMemo(
    () => (Array.isArray(params?.id) ? params.id[0] : params?.id),
    [params]
  );

  // Check if user is authenticated and has access to this seller dashboard
  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access the seller dashboard.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'seller' || user.sellerId !== sellerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this seller dashboard.</p>
        </div>
      </div>
    );
  }

  // If there's a profile error, we'll still show the dashboard but with a warning
  if (profileError) {
    console.warn('Error loading seller profile:', profileError);
  }

  if (
    !authenticated ||
    !user ||
    user.role !== "seller" ||
    user.sellerId !== sellerId
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Placeholder stats; replace with real data fetching later
  const stats = [
    { label: "Total Orders", value: 0, hint: "+0% vs last 7d" },
    { label: "Total Revenue", value: "$0", hint: "+0% vs last 7d" },
    { label: "Products", value: 0 },
    { label: "Pending Shipments", value: 0 },
  ];

  return (
    <section style={{ padding: 24, background: "#f9fafb", minHeight: "100%" }}>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Overview of your store performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Add product
          </button>
          <a 
            href={`/seller/${sellerId}/profile`}
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {sellerProfile?.storeName || user?.storeName || 'My Store'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </a>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#ffffff",
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Recent Orders</div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            No recent orders yet.
          </div>
        </div>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#ffffff",
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Top Products</div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            No products yet. Create your first product to see analytics.
          </div>
        </div>
      </div>
    </section>
  );
}
