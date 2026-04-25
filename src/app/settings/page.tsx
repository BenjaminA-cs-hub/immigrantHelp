"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const isCredentials = session?.user?.provider === "credentials";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePasswordChange = async () => {
    setPwMessage(null);
    if (newPassword !== confirmPassword) {
      setPwMessage({ text: "New passwords do not match.", ok: false });
      return;
    }
    setPwLoading(true);
    const res = await fetch("/api/settings/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setPwMessage({ text: data.error ?? "Password updated successfully!", ok: !data.error });
    if (!data.error) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPwLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const res = await fetch("/api/settings/account", { method: "DELETE" });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      setDeleteLoading(false);
      return;
    }
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-10">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

        {/* Change Password — only for credentials users */}
        {isCredentials ? (
          <section className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-gray-700">Change Password</h2>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>

            {pwMessage && (
              <p className={`text-sm text-center ${pwMessage.ok ? "text-green-600" : "text-red-500"}`}>
                {pwMessage.text}
              </p>
            )}

            <button
              onClick={handlePasswordChange}
              disabled={pwLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
            >
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </section>
        ) : (
          <section className="border border-gray-100 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-1">Change Password</h2>
            <p className="text-sm text-gray-400">Password management is handled by Google for your account.</p>
          </section>
        )}

        {/* Danger Zone */}
        <section className="border border-red-100 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-red-500">Danger Zone</h2>
          <p className="text-sm text-gray-500">
            Deleting your account is permanent and cannot be undone. All your data will be removed.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full border border-red-400 text-red-500 font-semibold py-3 rounded-xl text-sm hover:bg-red-50 transition"
            >
              Delete Account
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-gray-700 text-center">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
