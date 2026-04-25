import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-green-700 font-bold text-xl">
        🌿 RootKitchen
      </Link>
      <div className="flex gap-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-green-700 transition font-medium">
          Label Scanner
        </Link>
        <Link href="/health-resources" className="text-sm text-gray-600 hover:text-green-700 transition font-medium">
          Health Resources
        </Link>
      </div>
    </nav>
  );
}