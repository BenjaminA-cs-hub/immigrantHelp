"use client";
import { useState, useEffect } from "react";
import { getScans, ScanResult } from "@/lib/storage";
import ScanCard from "@/components/ScanCard";

export default function History() {
  const [scans, setScans] = useState<ScanResult[]>([]);

  const load = () => setScans(getScans());

  useEffect(() => { load(); }, []);

  if (scans.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-lg font-semibold text-gray-700">No scans yet</h2>
        <p className="text-gray-400 text-sm mt-2">Scan a nutrition label to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 max-w-xl mx-auto">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">All Scans</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Scan History</h1>
      <div className="flex flex-col gap-4">
        {scans.map(scan => (
          <ScanCard key={scan.id} scan={scan} onUpdate={load} />
        ))}
      </div>
    </div>
  );
}