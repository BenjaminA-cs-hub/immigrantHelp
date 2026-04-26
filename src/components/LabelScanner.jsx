"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveScan } from "@/lib/storage";

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

function NutrientCard({ nutrient }) {
  return (
    <div className={`flex items-start justify-between p-3 rounded-xl border ${levelColors[nutrient.level]}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelBadge[nutrient.level]}`}>
            {nutrient.level.toUpperCase()}
          </span>
          <span className="font-semibold text-sm">{nutrient.name}</span>
          <span className="text-xs opacity-60">{nutrient.amount}</span>
        </div>
        <p className="text-xs opacity-70 mt-1 ml-1">{nutrient.note}</p>
      </div>
    </div>
  );
}

function ResultCard({ result, onFindSubstitute }) {
  return (
    <div className="mt-6 flex flex-col gap-4">

      {/* Product Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Product</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{result.product_name}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{result.summary}</p>
      </div>

      {/* Nutrients */}
      {result.nutrients?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Nutrition Breakdown</p>
          <div className="flex flex-col gap-2">
            {result.nutrients.map((n, i) => (
              <NutrientCard key={i} nutrient={n} />
            ))}
          </div>
        </div>
      )}

      {/* Allergens */}
      {result.allergens?.length > 0 && (
        <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-red-400 uppercase tracking-widest mb-3">Allergens</p>
          <div className="flex flex-wrap gap-2">
            {result.allergens.map((a, i) => (
              <span key={i} className="bg-red-50 text-red-700 text-sm font-medium px-3 py-1 rounded-full border border-red-200">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cultural Note */}
      {result.cultural_note && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-blue-400 uppercase tracking-widest mb-2">Cultural Note</p>
          <p className="text-sm text-gray-600 leading-relaxed">{result.cultural_note}</p>
        </div>
      )}

      {/* Verdict */}
      {result.verdict && (
        <div className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-green-500 uppercase tracking-widest mb-2">Verdict</p>
          <p className="text-sm font-medium text-gray-800 leading-relaxed">{result.verdict}</p>
        </div>
      )}

      {/* Find Substitute Button */}
      {result.nutrients?.some(n => n.level === "bad") && (
        <button
          onClick={onFindSubstitute}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Find Healthier Substitute
        </button>
      )}

    </div>
  );
}

export default function LabelScanner() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState("English");
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setResult(null);
    setError("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      const mediaType = file.type;

      try {
        const res = await fetch("/api/scan-label", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mediaType, language }),
        });

        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setResult(data.result);
          saveScan({ ...data.result, imagePreview: URL.createObjectURL(file) });
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  };

  const handleFindSubstitute = () => {
    router.push(`/substitute?product=${encodeURIComponent(result.product_name)}`);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-xl mx-auto p-6">

        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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

        {/* Upload Button */}
        <label className="block w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-xl mb-4 transition">
          Scan Nutrition Label
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="Uploaded label"
            className="w-full rounded-xl mb-4 border border-gray-200"
          />
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <div className="text-green-600 font-medium text-base mb-2">
              Analyzing label...
            </div>
            <p className="text-gray-400 text-sm">This takes a few seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mt-4">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <ResultCard
            result={result}
            onFindSubstitute={handleFindSubstitute}
          />
        )}

      </div>
    </div>
  );
}