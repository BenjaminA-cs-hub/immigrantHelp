"use client";
import { useState, useEffect } from "react";

const TABS = [
  { id: "clinics", label: "🏥 Clinics" },
  { id: "pantries", label: "🥫 Food Pantries" },
  { id: "dietitians", label: "🥗 Dietitians" },
];

const dietitians = [
  {
    name: "NYU Langone Nutrition Services",
    borough: "Manhattan",
    address: "550 First Ave, New York, NY 10016",
    phone: "(212) 263-7300",
    languages: ["English", "Spanish", "Chinese"],
  },
  {
    name: "Montefiore Nutrition & Dietetics",
    borough: "Bronx",
    address: "111 East 210th St, Bronx, NY 10467",
    phone: "(718) 920-4321",
    languages: ["English", "Spanish"],
  },
  {
    name: "Maimonides Dietitian Center",
    borough: "Brooklyn",
    address: "4802 Tenth Ave, Brooklyn, NY 11219",
    phone: "(718) 283-6000",
    languages: ["English", "Spanish", "Arabic", "Haitian Creole"],
  },
  {
    name: "NewYork-Presbyterian Nutrition",
    borough: "Manhattan",
    address: "525 East 68th St, New York, NY 10065",
    phone: "(212) 746-5454",
    languages: ["English", "Spanish", "Chinese", "Bengali"],
  },
  {
    name: "Elmhurst Hospital Nutrition Clinic",
    borough: "Queens",
    address: "79-01 Broadway, Elmhurst, NY 11373",
    phone: "(718) 334-4000",
    languages: ["English", "Spanish", "Chinese", "Bengali", "Arabic"],
  },
  {
    name: "Staten Island University Nutrition",
    borough: "Staten Island",
    address: "475 Seaview Ave, Staten Island, NY 10305",
    phone: "(718) 226-9000",
    languages: ["English", "Spanish"],
  },
];

function ClinicCard({ item }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <h2 className="font-semibold text-gray-900 text-base">{item.facility_name || item.name}</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
          {item.facility_type || item.type || "Clinic"}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">📍 {item.borough}</p>
      {item.phone && <p className="text-sm text-gray-500 mb-1">📞 {item.phone}</p>}
      {item.reason && <p className="text-sm text-green-700 italic mt-2">{item.reason}</p>}
    </div>
  );
}

function PantryCard({ item }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <h2 className="font-semibold text-gray-900 text-base">
          {item.site_name || item.program_name || item.name}
        </h2>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
          Food Pantry
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">📍 {item.borough || item.site_borough}</p>
      {item.street_address && (
        <p className="text-sm text-gray-500 mb-1">🏠 {item.street_address}</p>
      )}
      {item.phone && <p className="text-sm text-gray-500 mb-1">📞 {item.phone}</p>}
      {item.reason && <p className="text-sm text-green-700 italic mt-2">{item.reason}</p>}
    </div>
  );
}

function DietitianCard({ item }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <h2 className="font-semibold text-gray-900 text-base">{item.name}</h2>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
          Dietitian
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">📍 {item.borough}</p>
      <p className="text-sm text-gray-500 mb-2">📞 {item.phone}</p>
      {item.languages && (
        <div className="flex flex-wrap gap-1">
          {item.languages.map((l) => (
            <span key={l} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {l}
            </span>
          ))}
        </div>
      )}
      {item.reason && <p className="text-sm text-green-700 italic mt-2">{item.reason}</p>}
    </div>
  );
}

export default function HealthResources() {
  const [activeTab, setActiveTab] = useState("clinics");
  const [clinics, setClinics] = useState([]);
  const [pantries, setPantries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI Search state
  const [query, setQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiResults, setAiResults] = useState([]);
  const [aiError, setAiError] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);

  useEffect(() => {
    if (activeTab === "clinics" && clinics.length === 0) fetchClinics();
    if (activeTab === "pantries" && pantries.length === 0) fetchPantries();
  }, [activeTab]);

  const fetchClinics = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://data.cityofnewyork.us/resource/q6fj-vxf8.json?$limit=50"
      );
      const data = await res.json();
      setClinics(data);
    } catch {
      setError("Could not load clinics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPantries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://data.cityofnewyork.us/resource/9d9t-bmk7.json?$limit=50"
      );
      const data = await res.json();
      setPantries(data);
    } catch {
      setError("Could not load pantries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    setAiLoading(true);
    setAiResults([]);
    setAiMessage("");
    setAiError("");
    setIsAiMode(true);

    try {
      const res = await fetch("/api/health-resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiMessage(data.message);
        setAiResults(data.results);
      }
    } catch {
      setAiError("Something went wrong. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const clearAiSearch = () => {
    setIsAiMode(false);
    setQuery("");
    setAiResults([]);
    setAiMessage("");
    setAiError("");
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center text-green-600 font-medium animate-pulse py-10">
          Loading resources...
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      );
    }
    if (activeTab === "clinics") {
      return (
        <div className="flex flex-col gap-4">
          {clinics.map((item, i) => <ClinicCard key={i} item={item} />)}
        </div>
      );
    }
    if (activeTab === "pantries") {
      return (
        <div className="flex flex-col gap-4">
          {pantries.map((item, i) => <PantryCard key={i} item={item} />)}
        </div>
      );
    }
    if (activeTab === "dietitians") {
      return (
        <div className="flex flex-col gap-4">
          {dietitians.map((item, i) => <DietitianCard key={i} item={item} />)}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-1">🏥 Health Resources</h1>
      <p className="text-gray-500 mb-6">
        Browse by category or search in any language
      </p>

      {/* AI Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
            placeholder="Search in any language... e.g. clínica en Queens, مستشفى في بروكلين"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleAiSearch}
            disabled={aiLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl transition disabled:opacity-50"
          >
            {aiLoading ? "..." : "Search"}
          </button>
        </div>

        {/* Example queries */}
        <div className="flex flex-wrap gap-2">
          {[
            "Clinics in Queens",
            "clínica en el Bronx",
            "مستشفى في بروكلين",
            "免费诊所 曼哈顿",
            "food pantry Brooklyn",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* AI Results Mode */}
      {isAiMode ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">AI search results for: <span className="font-medium text-gray-800">"{query}"</span></p>
            <button
              onClick={clearAiSearch}
              className="text-sm text-green-700 hover:underline"
            >
              ← Back to browse
            </button>
          </div>

          {aiLoading && (
            <div className="text-center text-green-600 font-medium animate-pulse py-10">
              🔍 Finding resources for you...
            </div>
          )}

          {aiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              {aiError}
            </div>
          )}

          {aiMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-green-800 text-sm">{aiMessage}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {aiResults.map((r, i) => (
              <ClinicCard key={i} item={r} />
            ))}
          </div>
        </div>
      ) : (
        /* Browse Mode with Tabs */
        <div>
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white"
                    : "text-gray-500 hover:text-green-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {renderTabContent()}
        </div>
      )}
    </div>
  );
}