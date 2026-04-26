"use client";
import { useState } from "react";
import { ScanResult, toggleBookmark, deleteScan } from "@/lib/storage";

const levelColors = {
  good: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  bad: "bg-red-50 text-red-700 border-red-200",
};

const levelBadge = {
  good: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  bad: "bg-red-100 text-red-700",
};

interface Props {
  scan: ScanResult;
  onUpdate: () => void;
}

export default function ScanCard({ scan, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(scan.scannedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(scan.id);
    onUpdate();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteScan(scan.id);
    onUpdate();
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

      {/* Collapsed Row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition text-left"
      >
        <div className="flex items-center gap-3">
          {/* Expand chevron */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`text-gray-400 transition-transform duration-200 shrink-0 ${expanded ? "rotate-90" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>

          <div>
            <p className="font-semibold text-gray-900 text-sm">{scan.product_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{date}</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {/* Bad nutrient indicator */}
          {scan.nutrients?.some(n => n.level === "bad") && (
            <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
              Warning
            </span>
          )}

          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-full border transition ${
              scan.bookmarked
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-gray-50 border-gray-200 text-gray-400 hover:text-green-600"
            }`}
          >
            <svg width="14" height="14" fill={scan.bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z" />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full border bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 transition"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 bg-white border-t border-gray-100 flex flex-col gap-4 pt-4">

          {/* Summary */}
          <p className="text-sm text-gray-500 leading-relaxed">{scan.summary}</p>

          {/* Nutrients */}
          {scan.nutrients?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Nutrition</p>
              <div className="flex flex-col gap-2">
                {scan.nutrients.map((n, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 rounded-lg border text-xs ${levelColors[n.level]}`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${levelBadge[n.level]}`}>
                        {n.level.toUpperCase()}
                      </span>
                      <span className="font-medium">{n.name}</span>
                    </div>
                    <span className="opacity-60">{n.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {scan.allergens?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Allergens</p>
              <div className="flex flex-wrap gap-2">
                {scan.allergens.map((a, i) => (
                  <span key={i} className="bg-red-50 text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Note */}
          {scan.cultural_note && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Cultural Note</p>
              <p className="text-sm text-gray-600 leading-relaxed">{scan.cultural_note}</p>
            </div>
          )}

          {/* Verdict */}
          {scan.verdict && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Verdict</p>
              <p className="text-sm text-gray-700">{scan.verdict}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}