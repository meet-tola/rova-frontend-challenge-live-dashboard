/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userType: "admin" | "user") => {
    setError("");
    setLoading(true);

    const credentials = {
      admin: { email: "admin@ryswift.com", password: "admin123" },
      user: { email: "user@ryswift.com", password: "user123" },
    };

    try {
      const creds = credentials[userType];
      const success = await login(creds.email, creds.password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      {/* Retained the main card layout shadow for separation, but removed it from all controls */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <img
              src="/favicon.svg"
              alt="RySwift Logo"
              className="w-9 h-9 shrink-0 select-none"
              draggable={false}
            />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              RySwift
            </h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 mb-6">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={loading}
              className="w-full h-auto py-2.5 px-3 min-h-11 text-base md:text-sm rounded-lg shadow-none focus-visible:shadow-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              className="w-full h-auto py-2.5 px-3 min-h-11 text-base md:text-sm rounded-lg shadow-none focus-visible:shadow-none"
            />
          </div>

          {error && <div className="text-red-600 text-sm font-medium pt-0.5">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-3 min-h-11.5 rounded-lg shadow-none hover:shadow-none transition-colors mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">
              Or use demo credentials
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => quickLogin("admin")}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 min-h-11.5 rounded-lg shadow-none hover:shadow-none transition-colors"
          >
            Login as Admin
          </Button>
          <Button
            type="button"
            onClick={() => quickLogin("user")}
            disabled={loading}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium py-3 min-h-11.5 rounded-lg shadow-none hover:shadow-none transition-colors"
          >
            Login as User
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
          <p className="font-semibold text-gray-800 mb-1.5">Demo Credentials:</p>
          <div className="space-y-0.5 font-medium">
            <p><span className="text-gray-400">Admin:</span> admin@ryswift.com / admin123</p>
            <p><span className="text-gray-400">User:</span> user@ryswift.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}