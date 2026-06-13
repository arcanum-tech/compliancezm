"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TYPES = ["sole_trader", "company", "partnership", "ngo"];
const INDUSTRIES = ["Retail", "Construction", "IT", "Agriculture", "Transport", "Food & Beverage", "Professional Services", "Other"];

export default function RegisterPage() {
  const router = useRouter();
  const CACHE_KEY = "compliancezm_register";
  const [form, setForm] = useState({ name: "", owner_name: "", phone: "", email: "", tpin: "", pacra_number: "", business_type: "company", industry: "Retail", registration_date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Auth guard
    const sessionRaw = localStorage.getItem("compliancezm_session");
    if (!sessionRaw) { router.replace("/login?redirect=/register"); return; }
    try {
      const { user } = JSON.parse(sessionRaw);
      setForm(prev => ({ ...prev, owner_name: prev.owner_name || user.name || "", phone: prev.phone || user.phone || "" }));
    } catch {}
    // Restore draft
    try { const s = sessionStorage.getItem(CACHE_KEY); if (s) { const d = JSON.parse(s); if (d) setForm(prev => ({ ...prev, ...d })); } } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(form)); } catch {}
  }, [form]);

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/businesses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    try { sessionStorage.removeItem(CACHE_KEY); } catch {}
    router.push(`/dashboard/${data.id}`);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50";

  return (
    <div className="min-h-screen" style={{ background: "#faf5ff" }}>
      <header style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-purple-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">ComplianceZM ✅</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Register Your Business</h2>
        <p className="text-sm text-gray-500 mb-6">Free to start. We&apos;ll build your compliance checklist automatically.</p>

        <form onSubmit={submit} className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-4">
            <h3 className="font-black text-gray-800">Business Details</h3>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Business name" required className={inp} />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.business_type} onChange={(e) => set("business_type", e.target.value)} className={inp}>
                {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.replace("_", " ")}</option>)}
              </select>
              <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inp}>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.tpin} onChange={(e) => set("tpin", e.target.value)} placeholder="ZRA TPIN" className={inp} />
              <input value={form.pacra_number} onChange={(e) => set("pacra_number", e.target.value)} placeholder="PACRA Number" className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Registration Date</label>
              <input type="date" value={form.registration_date} onChange={(e) => set("registration_date", e.target.value)} className={inp} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800">Contact Details</h3>
            <input value={form.owner_name} onChange={(e) => set("owner_name", e.target.value)} placeholder="Owner / Director full name" required className={inp} />
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone (e.g. 0976123456)" required className={inp} />
            <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email (optional)" type="email" className={inp} />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full text-white font-black py-4 rounded-xl text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
            {loading ? "Setting up..." : "Create My Compliance Dashboard →"}
          </button>
        </form>
      </main>
    </div>
  );
}
