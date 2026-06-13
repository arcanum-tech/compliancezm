import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import CompleteButton from "./CompleteButton";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, string> = { zra: "🧾", pacra: "🏢", council: "📜", workers_comp: "👷", napsa: "🏥", nhima: "📋", other: "📌" };

export default async function DashboardPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const { data: biz } = await supabaseAdmin.from("businesses").select("*").eq("id", id).single();
  if (!biz) return notFound();

  const { data: items } = await supabaseAdmin.from("compliance_items")
    .select("*").eq("business_id", id).order("due_date", { ascending: true });

  const isPro = biz.subscription_tier === "pro" && biz.subscription_expires_at && new Date(biz.subscription_expires_at) > new Date();

  const today = new Date().toISOString().split("T")[0];
  const pending = items?.filter(i => i.status !== "completed") ?? [];
  const overdue = pending.filter(i => i.due_date < today);
  const upcoming = pending.filter(i => i.due_date >= today);
  const completed = items?.filter(i => i.status === "completed") ?? [];

  const score = items?.length ? Math.round((completed.length / items.length) * 100) : 100;
  const scoreColor = score >= 80 ? "#065f46" : score >= 50 ? "#92400e" : "#991b1b";

  const payUrl = `https://arcanum-payments.vercel.app/pay?app=compliancezm&product=ComplianceZM+PRO&amount=150&callback=${encodeURIComponent(`https://compliancezm.vercel.app/api/subscription?business_id=${id}&status=success`)}`;

  return (
    <div className="min-h-screen" style={{ background: "#faf5ff" }}>
      <header style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }} className="text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-black text-lg">ComplianceZM ✅</h1>
            <p className="text-xs opacity-70">{biz.name}</p>
          </div>
          <Link href="/login" className="text-xs text-purple-200">Switch Business</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {sp.upgraded === "1" && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-3 text-sm font-semibold">
            🎉 You are now PRO! SMS reminders are active.
          </div>
        )}

        {/* Score + plan */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Compliance Score</p>
            <p className="text-4xl font-black" style={{ color: scoreColor }}>{score}%</p>
            <p className="text-xs text-gray-400 mt-1">{completed.length}/{items?.length ?? 0} items done</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
            <p className="font-black text-gray-800 text-sm mb-1">{isPro ? "⭐ PRO Plan" : "Free Plan"}</p>
            <p className="text-xs text-gray-500">{isPro ? `Active until ${new Date(biz.subscription_expires_at).toLocaleDateString("en-ZM")}` : "No SMS reminders"}</p>
            {!isPro && (
              <a href={payUrl} className="block text-center text-white font-black text-xs py-2 rounded-xl mt-3"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                Upgrade — ZMW 150/mo
              </a>
            )}
          </div>
        </div>

        {/* Overdue */}
        {overdue.length > 0 && (
          <div>
            <h2 className="font-black text-red-700 mb-3">⚠ Overdue ({overdue.length})</h2>
            <div className="space-y-3">
              {overdue.map((item: any) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{CATEGORY_ICONS[item.category] ?? "📌"}</span>
                    <div>
                      <p className="font-black text-gray-800 text-sm">{item.title}</p>
                      <p className="text-xs text-red-600">Due: {new Date(item.due_date).toLocaleDateString("en-ZM")}</p>
                      {item.penalty_info && <p className="text-xs text-gray-400">{item.penalty_info}</p>}
                    </div>
                  </div>
                  <CompleteButton itemId={item.id} businessId={id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="font-black text-gray-800 mb-3">Upcoming ({upcoming.length})</h2>
            <div className="space-y-3">
              {upcoming.map((item: any) => {
                const days = Math.ceil((new Date(item.due_date).getTime() - Date.now()) / 86400000);
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{CATEGORY_ICONS[item.category] ?? "📌"}</span>
                      <div>
                        <p className="font-black text-gray-800 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(item.due_date).toLocaleDateString("en-ZM")} · {days}d left</p>
                      </div>
                    </div>
                    <CompleteButton itemId={item.id} businessId={id} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="font-black text-gray-500 mb-3">Completed ({completed.length})</h2>
            <div className="space-y-2">
              {completed.map((item: any) => (
                <div key={item.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                  <span className="text-lg opacity-50">{CATEGORY_ICONS[item.category] ?? "📌"}</span>
                  <p className="text-sm text-gray-400 line-through">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!items?.length && (
          <div className="bg-white rounded-2xl p-8 text-center border border-purple-100 text-gray-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">Your compliance checklist is being set up.</p>
            <p className="text-xs mt-1">Items will appear here based on your business type and registration date.</p>
          </div>
        )}
      </main>
    </div>
  );
}
