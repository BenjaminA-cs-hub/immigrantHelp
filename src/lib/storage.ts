export interface ScanResult {
  id: string;
  scannedAt: string;
  product_name: string;
  summary: string;
  nutrients: {
    name: string;
    amount: string;
    level: "good" | "warning" | "bad";
    note: string;
  }[];
  allergens: string[];
  cultural_note: string | null;
  verdict: string | null;
  bookmarked: boolean;
  imagePreview?: string;
}

export function getScans(): ScanResult[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("rootkitchen_scans");
  return raw ? JSON.parse(raw) : [];
}

export function saveScan(result: Omit<ScanResult, "id" | "scannedAt" | "bookmarked">): ScanResult {
  const scans = getScans();
  const newScan: ScanResult = {
    ...result,
    id: Date.now().toString(),
    scannedAt: new Date().toISOString(),
    bookmarked: false,
  };
  scans.unshift(newScan);
  localStorage.setItem("rootkitchen_scans", JSON.stringify(scans));
  return newScan;
}

export function toggleBookmark(id: string): void {
  const scans = getScans();
  const updated = scans.map(s =>
    s.id === id ? { ...s, bookmarked: !s.bookmarked } : s
  );
  localStorage.setItem("rootkitchen_scans", JSON.stringify(updated));
}

export function deleteScan(id: string): void {
  const scans = getScans();
  const updated = scans.filter(s => s.id !== id);
  localStorage.setItem("rootkitchen_scans", JSON.stringify(updated));
}