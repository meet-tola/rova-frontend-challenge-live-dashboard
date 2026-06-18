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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8 flex flex-col items-center justify-center">
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

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
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
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
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
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or use demo credentials
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => quickLogin("admin")}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login as Admin
          </Button>
          <Button
            type="button"
            onClick={() => quickLogin("user")}
            disabled={loading}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white"
          >
            Login as User
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <p>Admin: admin@ryswift.com / admin123</p>
          <p>User: user@ryswift.com / user123</p>
        </div>
      </div>
    </div>
  );
}
