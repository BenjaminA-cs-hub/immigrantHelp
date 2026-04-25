import LabelScanner from "../components/LabelScanner";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop welcome header */}
      <div className="hidden md:block max-w-5xl mx-auto px-8 pt-10 pb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to RootKitchen</h2>
        <p className="text-gray-500 text-sm mt-1">Scan a food label or find an ingredient substitute.</p>
      </div>

      <LabelScanner />

      <div className="max-w-xl mx-auto px-6 pb-10">
        <Link href="/substitute">
          <button className="w-full border border-green-600 text-green-700 font-semibold py-3 rounded-xl hover:bg-green-50 transition">
            🔍 Find an ingredient substitute
          </button>
        </Link>
      </div>
    </div>
  );
}