"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";

export default function CartPage({ params }) {
  const { userId } = params || {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function fetchCart() {
      try {
        setError("");
        setLoading(true);
        const res = await axios.get("/api/cart");
        if (mounted && res.data?.success) {
          const cart = res.data.data;
          const mapped = (cart.items || []).map((it) => ({
            id: String(it._id),
            name: it.part?.name || it.nameSnapshot || "",
            image: it.part?.images?.[0] || it.imageSnapshot || "/vercel.svg",
            price: Number(it.part?.price ?? it.priceAtAdd ?? 0),
            quantity: it.quantity || 1,
            brand: it.part?.brand?.name || it.brandSnapshot || "",
          }));
          setItems(mapped);
        }
      } catch (e) {
        if (mounted) setError("Failed to load cart");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCart();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const updateQty = async (id, delta) => {
    const next = items.find((i) => i.id === id)?.quantity || 1;
    const desired = Math.max(1, next + delta);
    try {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, quantity: desired } : it))
      );
      await axios.put(`/api/cart/items/${id}`, { quantity: desired });
    } catch (_e) {
      // On error, refetch cart for consistency
      try {
        const res = await axios.get("/api/cart");
        if (res.data?.success) {
          const cart = res.data.data;
          const mapped = (cart.items || []).map((it) => ({
            id: String(it._id),
            name: it.part?.name || it.nameSnapshot || "",
            image: it.part?.images?.[0] || it.imageSnapshot || "/vercel.svg",
            price: Number(it.part?.price ?? it.priceAtAdd ?? 0),
            quantity: it.quantity || 1,
            brand: it.part?.brand?.name || it.brandSnapshot || "",
          }));
          setItems(mapped);
        }
      } catch {}
    }
  };

  const removeItem = async (id) => {
    try {
      setItems((prev) => prev.filter((it) => it.id !== id));
      await axios.delete(`/api/cart/items/${id}`);
    } catch (_e) {
      // Refetch on error to stay consistent
      try {
        const res = await axios.get("/api/cart");
        console.log(res);

        if (res.data?.success) {
          const cart = res.data.data;
          const mapped = (cart.items || []).map((it) => ({
            id: String(it._id),
            name: it.part?.name || it.nameSnapshot || "",
            image: it.part?.images?.[0] || it.imageSnapshot || "/vercel.svg",
            price: Number(it.part?.price ?? it.priceAtAdd ?? 0),
            quantity: it.quantity || 1,
            brand: it.part?.brand?.name || it.brandSnapshot || "",
          }));
          setItems(mapped);
        }
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/parts"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          <div className="text-sm text-gray-600">Cart for user: {userId}</div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
            Loading cart...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600">Add items from the parts catalog.</p>
            <Link
              href="/parts"
              className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Browse Parts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-24 w-24 rounded-md object-contain bg-gray-50 border"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {it.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            Brand: {it.brand}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(it.id)}
                          className="cursor-pointer text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1">
                          <button
                            onClick={() => updateQty(it.id, -1)}
                            className="p-1 text-gray-700 hover:text-gray-900"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm text-gray-900">
                            {it.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(it.id, 1)}
                            className="p-1 text-gray-700 hover:text-gray-900"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(it.price * it.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 h-fit">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">Calculated at checkout</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
