import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <p className="text-xs text-green-600 uppercase tracking-widest font-semibold mb-4">
          For immigrant families in New York City
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Understanding food shouldn't require
          <span className="text-green-600"> a translator</span>
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto mb-10">
          RootKitchen helps immigrants navigate US food labels, find health resources, 
          and make informed choices — in their own language.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/scan"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            Scan a Label
          </Link>
          <Link
            href="/health-resources"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-8 py-3 rounded-xl transition"
          >
            Find Health Resources
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-100 max-w-4xl mx-auto" />

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-2">What we offer</p>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Built for your community
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Nutrition Label Scanner</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Snap a photo of any US food label and get a plain-language breakdown in your language — with cultural context that matters to your diet.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-amber-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Ingredient Substitutes</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Can't find an ingredient from home? Find healthy US alternatives and where to buy them near you in NYC.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Health Resources</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Find clinics, food pantries, and dietitians across NYC that speak your language and accept your insurance.
            </p>
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-100 max-w-4xl mx-auto" />

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-2">How it works</p>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Three simple steps
        </h2>

        <div className="flex flex-col gap-8">

          <div className="flex items-start gap-5">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Scan any food label</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Take a photo of a nutrition label at the grocery store. RootKitchen reads it instantly using AI vision.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Get a breakdown in your language</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Choose from 7 languages. We explain key nutrients, allergens, and flag anything that may not suit your traditional diet.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Take action</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Find a healthier substitute, locate a nearby health clinic, or bookmark the scan to review later.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-green-600 mt-8">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your health journey starts here
          </h2>
          <p className="text-green-100 mb-8 leading-relaxed">
            Join thousands of immigrant families in NYC making informed food choices every day.
          </p>
          <Link
            href="/scan"
            className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

    </main>
  );
}