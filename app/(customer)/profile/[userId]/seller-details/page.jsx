"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserSession } from "@/context/userSession";
import axios from "axios";

export default function SellerDetailsPage() {
  const { user, authenticated, loading, refresh } = useUserSession();
  const params = useParams();
  const router = useRouter();

  const routeUserId = useMemo(
    () => (Array.isArray(params?.userId) ? params.userId[0] : params?.userId),
    [params]
  );

  const [form, setForm] = useState({
    storeName: "",
    companyName: "",
    email: user?.email || "",
    phone: "",
    logoUrl: "",
    description: "",
    address: {
      fullName: user?.name || "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  if (!loading && (!authenticated || !user || user.id !== routeUserId)) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        userId: user.id,
        storeName: form.storeName,
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        logoUrl: form.logoUrl,
        description: form.description,
        address: form.address,
      };
      const res = await axios.post("/api/seller/register", payload);
      if (res?.data?.success) {
        // Refresh user session to get updated role
        await refresh();
        router.push(`/seller/${res.data.sellerId}/dashboard`);
      } else {
        setError(res?.data?.message || "Could not register seller");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Request failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seller details</h1>
          <p className="text-gray-500">
            Provide your store and business information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Store information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Store name
                </label>
                <input
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Company name
                </label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Business email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                {/* <label className="block text-sm text-gray-600 mb-1">
                  Logo URL
                </label>
                <input
                  name="logoUrl"
                  value={form.logoUrl}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                /> */}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Business address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Full name
                </label>
                <input
                  name="fullName"
                  value={form.address.fullName}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.address.phone}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Street
                </label>
                <input
                  name="street"
                  value={form.address.street}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  name="city"
                  value={form.address.city}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  State
                </label>
                <input
                  name="state"
                  value={form.address.state}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ZIP</label>
                <input
                  name="zip"
                  value={form.address.zip}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Country
                </label>
                <input
                  name="country"
                  value={form.address.country}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer px-5 py-2 rounded-lg border border-gray-300 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save & continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
