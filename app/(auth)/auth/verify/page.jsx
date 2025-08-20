"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const email =
    emailFromQuery ||
    (typeof window !== "undefined"
      ? window.localStorage.getItem("pending_email") || ""
      : "");

  const CODE_LENGTH = 6;
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const isComplete = useMemo(
    () => code.join("").length === CODE_LENGTH,
    [code]
  );

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (idx, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (!digit && value !== "") return; // ignore non-digits

    const next = [...code];
    next[idx] = digit || "";
    setCode(next);

    if (digit && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const next = [...code];
        next[idx] = "";
        setCode(next);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1)
      inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!paste) return;
    const next = paste.split("");
    while (next.length < CODE_LENGTH) next.push("");
    setCode(next);
    const focusIndex = Math.min(paste.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    setError("");
    setInfo("");
    try {
      // UI only for now
      const { data } = await axios.post("/api/auth/verify", {
        email,
        code: code.join(""),
      });
      if (!data?.success) {
        setError(data?.message || "Verification failed.");
        return;
      }
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("pending_email");
      }
      setInfo("Email verified. Redirecting...");
      // Redirect - for now go to home
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    if (!email) {
      setError("Email missing. Please start from registration.");
      return;
    }
    setResending(true);
    setError("");
    setInfo("");
    try {
      const { data } = await axios.post("/api/auth/resend", { email });
      if (!data?.success) {
        setError(data?.message || "Failed to resend email.");
        return;
      }
      setInfo("Verification email resent.");
      setResendTimer(60);
    } catch (e) {
      const msg =
        e?.response?.data?.message || "Network error. Please try again.";
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {email ? (
                <>
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium">{email}</span>
                </>
              ) : (
                <>Enter the 6-digit code we sent to your email</>
              )}
            </p>
          </div>

          <div
            className="flex items-center justify-center gap-3"
            onPaste={handlePaste}
          >
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                aria-label={`Digit ${idx + 1}`}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={!isComplete || isSubmitting}
            className={`mt-6 w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg text-white text-sm font-medium transition-colors ${
              !isComplete || isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Didn't receive the email?</p>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || resending}
              className={`mt-2 text-sm font-medium ${
                resendTimer > 0 || resending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {resending
                ? "Resending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend Email"}
            </button>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {info && <p className="mt-2 text-sm text-green-600">{info}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
