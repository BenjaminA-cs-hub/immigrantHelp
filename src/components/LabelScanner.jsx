"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const levelColors = {
  good: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  bad: "bg-red-100 text-red-700 border-red-200",
};

const levelIcons = {
  good: "🟢",
  warning: "🟡",
  bad: "🔴",
};

function NutrientCard({ nutrient }) {
  return (
    <div className={`flex items-start justify-between p-3 rounded-xl border ${levelColors[nutrient.level]}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span>{levelIcons[nutrient.level]}</span>
          <span className="font-semibold text-sm">{nutrient.name}</span>
          <span className="text-xs opacity-70">{nutrient.amount}</span>
        </div>
        <p className="text-xs opacity-80 ml-6">{nutrient.note}</p>
      </div>
    </div>
  );
}

function ResultCard({ result, onFindSubstitute }) {
  return (
    <div className="mt-6 flex flex-col gap-4">

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Product</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{result.product_name}</h2>
        <p className="text-sm text-gray-600">{result.summary}</p>
      </div>

      {result.nutrients?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">⚠️ Nutrients to Know</p>
          <div className="flex flex-col gap-2">
            {result.nutrients.map((n, i) => (
              <NutrientCard key={i} nutrient={n} />
            ))}
          </div>
        </div>
      )}

      {result.allergens?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-red-400 uppercase tracking-wide mb-3">🚨 Allergens</p>
          <div className="flex flex-wrap gap-2">
            {result.allergens.map((a, i) => (
              <span key={i} className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full border border-red-200">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.cultural_note && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-blue-400 uppercase tracking-wide mb-2">🌍 Cultural Note</p>
          <p className="text-sm text-blue-800">{result.cultural_note}</p>
        </div>
      )}

      {result.verdict && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-green-400 uppercase tracking-wide mb-2">✅ Verdict</p>
          <p className="text-sm font-medium text-green-800">{result.verdict}</p>
        </div>
      )}

      {result.nutrients?.some(n => n.level === "bad") && (
        <button
          onClick={onFindSubstitute}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          🔄 Find Healthier Substitute
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

        <label className="block w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-xl mb-4 transition">
          📸 Upload or Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="Uploaded label"
            className="w-full rounded-xl mb-4 border border-gray-200"
          />
        )}

        {loading && (
          <div className="text-center py-10">
            <div className="text-green-600 font-medium animate-pulse text-lg mb-2">
              🔍 Analyzing your label...
            </div>
            <p className="text-gray-400 text-sm">This takes a few seconds</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mt-4">
            {error}
          </div>
        )}

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