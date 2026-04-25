"use client";

import { useState } from "react";

interface SubstituteResult {
  about: string;
  substitutes: { name: string; reason: string }[];
  whereToFind: string;
}

export default function SubstitutePage() {
  const [query, setQuery] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [result, setResult] = useState<SubstituteResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/substitute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient: query, language }),
      });

      const data = await res.json();
      if (data.error) {
        setError("Something went wrong. Try again.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-green-700 mb-2">🌿 RootKitchen</h1>
      <p className="text-gray-500 mb-6">Find substitutes for ingredients in your language</p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select your language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>Arabic</option>
          <option>Chinese</option>
          <option>Haitian Creole</option>
          <option>Bengali</option>
        </select>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. bitter melon, ackee, taro..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50"
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="text-center text-green-600 font-medium animate-pulse">
          🔍 Finding substitutes near you...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-4">

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h2 className="font-bold text-green-800 mb-2">🌱 About this ingredient</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{result.about}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h2 className="font-bold text-gray-800 mb-3">🔄 Substitutes you can find here</h2>
            <div className="flex flex-col gap-3">
              {result.substitutes && result.substitutes.map((sub: { name: string; reason: string }, i: number) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-none last:pb-0">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{sub.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{sub.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <h2 className="font-bold text-amber-800 mb-2">📍 Where to find it in Queens</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{result.whereToFind}</p>
          </div>

        </div>
      )}

    </div>
  );
}