"use client";
import { useState } from "react";

export default function LabelScanner() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState("English");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setResult("");

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

        const text = await res.text();
        console.log("Server response:", text);

        const data = JSON.parse(text);
        setResult(data.result);
      } catch (err) {
        console.error("Error:", err);
        setResult("Something went wrong. Check the console for details.");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-green-700 mb-2">🌿 RootKitchen</h1>
      <p className="text-gray-500 mb-6">Scan a nutrition label in your language</p>

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
        <div className="text-center text-green-600 font-medium animate-pulse">
          🔍 Analyzing your label...
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
          <h2 className="font-bold text-green-800 mb-2">📋 Nutrition Breakdown</h2>
          <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {result}
          </p>
        </div>
      )}

    </div>
  );
}