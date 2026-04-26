"use client";
import { useState, useEffect } from "react";
import { getScans, ScanResult } from "@/lib/storage";
import ScanCard from "@/components/ScanCard";

export default function Bookmarked() {
  const [scans, setScans] = useState<ScanResult[]>([]);

  const load = () => {
    const all = getScans();
    setScans(all.filter(s => s.bookmarked));
  };

  useEffect(() => { load(); }, []);

  if (scans.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-700">No bookmarks yet</h2>
        <p className="text-gray-400 text-sm mt-2">Scan a label and bookmark it to save it here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 max-w-xl mx-auto">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Saved</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookmarks</h1>
      <div className="flex flex-col gap-4">
        {scans.map(scan => (
          <ScanCard key={scan.id} scan={scan} onUpdate={load} />
        ))}
      </div>
    </div>
  );
}
