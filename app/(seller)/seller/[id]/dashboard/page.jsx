"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useUserSession } from "@/context/userSession";

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

  const sellerId = useMemo(
    () => (Array.isArray(params?.id) ? params.id[0] : params?.id),
    [params]
  );

  // Check if user is authenticated and has access to this seller dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
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
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: "#6b7280", marginTop: 4 }}>
            Overview of your store performance
          </p>
        </div>
        <div>
          <button
            style={{
              background: "#111827",
              color: "#ffffff",
              border: 0,
              borderRadius: 8,
              padding: "10px 14px",
              cursor: "pointer",
            }}
          >
            Add product
          </button>
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
