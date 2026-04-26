"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";


export default function AuthPage() {

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    if (mode === "signup" && !username.trim()) {
      setError("Username is required.");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        setError("Server error during signup. Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      rememberMe: mode === "signup" ? rememberMe.toString() : "false",
      redirect: false,
    });

    if (!result?.ok || result?.error) {
      setError(result?.error === "CredentialsSignin" || !result?.error ? "Invalid email or password." : result.error);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  };

  const switchMode = (next: "signin" | "signup") => {
    setMode(next);
    setError(null);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="RootKitchen" className="w-28 h-28 object-contain" />
          <h1 className="text-2xl font-bold text-green-700 mt-1">RootKitchen</h1>
          <p className="text-gray-400 text-sm mt-1">Your food, in your language.</p>
        </div>

        <div className="border border-gray-200 rounded-2xl p-8 flex flex-col gap-4">

          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-2">
            <button
              onClick={() => switchMode("signin")}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                mode === "signin" ? "bg-green-600 text-white" : "bg-white text-gray-500"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                mode === "signup" ? "bg-green-600 text-white" : "bg-white text-gray-500"
              }`}
            >
              Sign up
            </button>
          </div>

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
          />

          {mode === "signup" && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span className="text-sm text-gray-500">Remember me for 30 days</span>
            </label>
          )}

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-50 rounded-lg py-2 px-3">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
          >
            {loading
              ? mode === "signup" ? "Creating account..." : "Signing in..."
              : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition font-medium text-sm text-gray-700"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13 17.8 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-9.9 7.1-17z"/>
              <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.6 10.6l7.9-6z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.4-4.2-13.3-9.9l-7.9 6C6.5 42.5 14.6 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

        </div>

        <p className="text-center text-xs text-gray-300 mt-6">Built for Queens, NY communities</p>

      </div>
    </div>
  );
}
