"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from "@/components/icons";
import { KitLogo } from "@/components/kit-logo";
import { DEMO_PASSWORD, demoAccounts, type DemoAccount } from "@/lib/demo-accounts";
import { roles } from "@/lib/roles";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const account = demoAccounts.find(
      (a) =>
        a.username.toLowerCase() === username.trim().toLowerCase() &&
        a.password === password,
    );

    if (!account) {
      setError(
        "Invalid username or password. Try one of the demo accounts below.",
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);
    router.push(`/${account.role}`);
  }

  function handleDemoSelect(account: DemoAccount) {
    setUsername(account.username);
    setPassword(account.password);
    setError(null);
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-stone-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <KitLogo className="h-24 w-24" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-rose-800">
            KIT Portal
          </h1>
          <p className="mt-2 text-stone-500">
            Unified Student Management Portal
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-stone-700"
              >
                Username
              </label>
              <div className="mt-1.5 relative">
                <BriefcaseIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. STU-2024-001"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-rose-700 hover:text-rose-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="mt-1.5 relative">
                <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-rose-200 bg-white py-3 pl-11 pr-11 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-800 py-3 font-semibold text-white transition-colors hover:bg-rose-900 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
              {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-rose-100 bg-white/70 p-6">
          <h2 className="text-sm font-semibold text-stone-700">
            Demo Accounts
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Click a role to autofill credentials, then press Sign In. Password
            for every demo account is{" "}
            <span className="font-mono font-medium text-stone-700">
              {DEMO_PASSWORD}
            </span>
            .
          </p>
          <ul className="mt-4 space-y-1.5">
            {demoAccounts.map((account) => {
              const role = roles.find((r) => r.slug === account.role);
              const isSelected = username === account.username;
              return (
                <li key={account.role}>
                  <button
                    type="button"
                    onClick={() => handleDemoSelect(account)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? "border-rose-400 bg-rose-50"
                        : "border-transparent hover:border-rose-100 hover:bg-rose-50/60"
                    }`}
                  >
                    <span className="font-medium text-stone-700">
                      {role?.label ?? account.role}
                    </span>
                    <span className="font-mono text-xs text-stone-400">
                      {account.username}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 flex items-center justify-center gap-6 text-sm text-stone-500">
          <Link href="#" className="hover:text-rose-700">
            Help Center
          </Link>
          <Link href="#" className="hover:text-rose-700">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
