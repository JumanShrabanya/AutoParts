"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, ShoppingCart, CreditCard } from "lucide-react";

export default function PartDetailsPage({ params }) {
  const { partId } = params || {};
  const router = useRouter();

  // Start empty; fetch actual product on mount
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadPart() {
      if (!partId) return;
      try {
        setError("");
        setLoading(true);
        const res = await axios.get(`/api/parts/${partId}`);
        if (mounted && res?.data?.success && res.data.data) {
          const p = res.data.data;
          setProduct({
            _id: p._id,
            name: p.name,
            brand: p.brand?.name || p.brand || "",
            price: p.price ?? 0,
            rating: p.rating ?? 0,
            reviewCount: p.reviewCount ?? 0,
            stockQuantity: p.stockQuantity ?? 0,
            images:
              Array.isArray(p.images) && p.images.length > 0
                ? p.images
                : ["/vercel.svg"],
            description: p.description || "",
            specifications: Array.isArray(p.specifications)
              ? p.specifications
              : Object.entries(p.specifications || {}).map(
                  ([label, value]) => ({ label, value })
                ),
            compatibility: Array.isArray(p.compatibility)
              ? typeof p.compatibility[0] === "string"
                ? p.compatibility
                : p.compatibility
                    .map((c) =>
                      c?.make && c?.model
                        ? `${c.make} ${c.model} (${c.yearFrom ?? "?"}-${
                            c.yearTo ?? "?"
                          })`
                        : ""
                    )
                    .filter(Boolean)
              : [],
          });
        }
      } catch (_e) {
        setError("Failed to load part details");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPart();
    return () => {
      mounted = false;
    };
  }, [partId]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  const increaseQty = () =>
    setQuantity((q) => Math.min(q + 1, Math.max(product.stockQuantity, 1)));
  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));

  const formattedPrice = useMemo(
    () => `$${Number((product && product.price) || 0).toFixed(2)}`,
    [product?.price]
  );

  const handleAddToCart = async () => {
    if (!partId) return;
    try {
      setAdding(true);
      setAddMessage("");
      await axios.post("/api/cart/items", { partId, quantity });
      setAddMessage("Added to cart");
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push("/auth/register");
        return;
      }
      setAddMessage("Failed to add to cart");
    } finally {
      setAdding(false);
      setTimeout(() => setAddMessage(""), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/parts"
            className="inline-flex items-center gap-1 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Parts
          </Link>
        </div>

        {loading && (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-800"></div>
              Loading part details...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {product && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Gallery */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[activeImageIdx]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((src, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square overflow-hidden rounded-md border ${
                      activeImageIdx === idx
                        ? "border-gray-900"
                        : "border-gray-200 hover:border-gray-300"
                    } bg-white`}
                  >
                    <img
                      src={src}
                      alt="thumb"
                      className="h-full w-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {product.name}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Brand: {product.brand}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i + 1 <= Math.floor(product.rating)
                            ? "fill-amber-500"
                            : "fill-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-semibold text-gray-900">
                    {formattedPrice}
                  </span>
                  <span
                    className={`text-sm ${
                      product.stockQuantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stockQuantity > 0 ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-700">
                  {product.description}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <h3 className="mb-2 text-sm font-medium text-gray-900">
                      Specifications
                    </h3>
                    <dl className="space-y-1">
                      {product.specifications.map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <dt className="text-gray-600">{s.label}</dt>
                          <dd className="font-medium text-gray-900">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-3">
                    <h3 className="mb-2 text-sm font-medium text-gray-900">
                      Compatibility
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {product.compatibility.map((c) => (
                        <li key={c} className="list-disc pl-4">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  {/* Quantity */}
                  <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:w-auto sm:justify-start sm:gap-3">
                    <span className="text-sm text-gray-700">Qty</span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={decreaseQty}
                        className="h-9 w-9 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={product.stockQuantity}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(
                              1,
                              Math.min(
                                Number(e.target.value || 1),
                                product.stockQuantity
                              )
                            )
                          )
                        }
                        className="mx-2 h-9 w-14 rounded-md border border-gray-200 bg-white text-center text-sm text-gray-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={increaseQty}
                        className="h-9 w-9 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:opacity-50 sm:w-auto"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none sm:w-auto"
                  >
                    <CreditCard className="h-4 w-4" />
                    Buy Now
                  </button>
                </div>
                {addMessage && (
                  <div className="mt-2 text-sm text-gray-700">{addMessage}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
