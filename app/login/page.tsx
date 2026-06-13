"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch(`/api/businesses?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.id) { setError("Business not found. Please register first."); return; }
    router.push(`/dashboard/${data.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#faf5ff" }}>
      <Link href="/" className="text-sm font-bold mb-6" style={{ color: "#7c3aed" }}>← ComplianceZM</Link>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-purple-100 space-y-4">
        <div className="text-center">
          <p className="text-3xl mb-2">✅</p>
          <h1 className="text-xl font-black text-gray-900">My Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Enter your registered phone number</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (e.g. 0976123456)" required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full text-white font-black py-3 rounded-xl text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
            {loading ? "..." : "Access Dashboard →"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400">Not registered? <Link href="/register" className="font-bold" style={{ color: "#7c3aed" }}>Register here →</Link></p>
      </div>
    </div>
  );
}
