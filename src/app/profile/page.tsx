"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ETHNICITIES = [
  "Prefer not to say",
  "Hispanic / Latino",
  "Black / African American",
  "African",
  "Caribbean",
  "South Asian",
  "East Asian",
  "Southeast Asian",
  "Middle Eastern / North African",
  "European",
  "Pacific Islander",
  "Native American",
  "Mixed / Multiracial",
  "Other",
];

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [ethnicity, setEthnicity] = useState("Prefer not to say");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (data.error) { setMessage({ text: data.error, ok: false }); return; }
        if (data.username) setUsername(data.username);
        if (data.ethnicity != null) setEthnicity(data.ethnicity);
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
      });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    let avatar_url: string | undefined;

    if (avatarFile) {
      const form = new FormData();
      form.append("avatar", avatarFile);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
      const data = await res.json();
      if (data.error) {
        setMessage({ text: data.error, ok: false });
        setLoading(false);
        return;
      }
      avatar_url = data.url;
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, ethnicity, ...(avatar_url ? { avatar_url } : {}) }),
    });
    const data = await res.json();

    if (data.error) {
      setMessage({ text: data.error, ok: false });
    } else {
      await update({ name: username, image: avatar_url ?? session?.user?.image });
      setMessage({ text: "Profile updated!", ok: true });
    }
    setLoading(false);
  };

  const currentAvatar = avatarPreview ?? session?.user?.image;
  const initial = (username || session?.user?.name || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 hover:opacity-80 transition group"
          >
            {currentAvatar ? (
              <Image src={currentAvatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-3xl font-bold text-gray-400">
                {initial}
              </span>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <span className="text-white text-xs font-semibold">Change</span>
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <p className="text-xs text-gray-400 mt-2">Click to upload a new photo</p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={session?.user?.email ?? ""}
              disabled
              className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
            <select
              value={ethnicity}
              onChange={e => setEthnicity(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {ETHNICITIES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {message && (
            <p className={`text-sm text-center ${message.ok ? "text-green-600" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
