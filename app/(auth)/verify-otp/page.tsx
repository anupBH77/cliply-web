"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import Link from "next/link";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(emailParam || "");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authApi.verifyEmail({ email, otp });
      router.push("/login?verified=true");
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 my-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
        <p className="text-gray-400">
          We sent a 6-digit code to <br/>
          <span className="font-semibold text-white">{email || "your email"}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleVerify}>
        {!emailParam && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="otp">
            6-Digit OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            required
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-300 text-center tracking-[0.5em] font-mono text-xl"
            placeholder="000000"
            maxLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-zinc-600 to-zinc-600 text-white font-semibold hover:from-zinc-500 hover:to-zinc-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Verify Account"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
        <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">
          &larr; Back to login
        </Link>
      </div>
    </div>
  );
}

export default function verifyEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-zinc-600/30 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 my-8 flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      }>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
