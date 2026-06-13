import Link from "next/link";
import HeaderAuth from "./HeaderAuth";

const COMPLIANCE_ITEMS = [
  { icon: "🧾", title: "ZRA Tax Returns", desc: "VAT, PAYE, income tax filing deadlines" },
  { icon: "🏢", title: "PACRA Annual Returns", desc: "Company annual return submissions" },
  { icon: "📜", title: "Business Licence", desc: "Lusaka City Council licence renewals" },
  { icon: "👷", title: "Workers Compensation", desc: "WCF contributions and registration" },
  { icon: "🏥", title: "NAPSA Contributions", desc: "National Pension Scheme contributions" },
  { icon: "📋", title: "NHIMA Contributions", desc: "Health insurance contributions" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#faf5ff", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }} className="text-white px-6 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(255,255,255,0.2)" }}>✅</div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">ComplianceZM</h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Business Compliance Made Easy 🇿🇲</p>
            </div>
          </div>
          <HeaderAuth />
        </div>
      </header>

      <section style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }} className="text-white px-6 pt-10 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
            🛡 ZRA · PACRA · LCC · WCF · NAPSA
          </div>
          <h2 className="text-4xl font-black mb-3 leading-tight">
            Stay compliant.<br />
            <span style={{ color: "#e9d5ff" }}>Avoid penalties.</span>
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
            We track your ZRA deadlines, PACRA returns, licence renewals and more — and remind you before it&apos;s too late.
          </p>
          <Link href="/register" className="inline-block font-black px-8 py-3 rounded-xl text-sm"
            style={{ background: "white", color: "#7c3aed" }}>
            Register Your Business — Free →
          </Link>
        </div>
      </section>

      {/* What we track */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h3 className="text-xl font-black text-gray-800 mb-2">What we track for you</h3>
        <p className="text-sm text-gray-500 mb-6">Never pay a penalty again</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPLIANCE_ITEMS.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
              <p className="text-3xl mb-3">{item.icon}</p>
              <p className="font-black text-gray-900 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <p className="font-black text-gray-800 text-lg mb-1">Free</p>
            <p className="text-3xl font-black mb-3" style={{ color: "#7c3aed" }}>ZMW 0</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>✓ Compliance checklist</li>
              <li>✓ Track up to 3 deadlines</li>
              <li>✓ Manual status updates</li>
              <li>✗ SMS/WhatsApp reminders</li>
            </ul>
            <Link href="/register" className="block text-center font-black py-2.5 rounded-xl text-sm mt-4 border-2"
              style={{ borderColor: "#7c3aed", color: "#7c3aed" }}>Get Started Free</Link>
          </div>
          <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
            <p className="font-black text-lg mb-1">PRO</p>
            <p className="text-3xl font-black mb-3">ZMW 150<span className="text-sm font-normal">/mo</span></p>
            <ul className="text-xs space-y-1.5" style={{ color: "#e9d5ff" }}>
              <li>✓ Unlimited deadlines tracked</li>
              <li>✓ SMS & WhatsApp reminders</li>
              <li>✓ 7-day & 1-day advance alerts</li>
              <li>✓ Compliance health score</li>
            </ul>
            <Link href="/register" className="block text-center font-black py-2.5 rounded-xl text-sm mt-4"
              style={{ background: "white", color: "#7c3aed" }}>Upgrade to PRO</Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-xs" style={{ background: "#111827", color: "#9ca3af" }}>
        <p className="text-white font-black text-base mb-1">ComplianceZM ✅</p>
        <p className="mb-1">Powered by <span style={{ color: "#e9d5ff" }}>ARCANUM TECH LIMITED</span> · TPIN: 2003723894 · Lusaka, Zambia</p>
        <p style={{ color: "#6b7280" }}>Reminders are advisory. Always confirm deadlines directly with the relevant authority.</p>
      </footer>
    </div>
  );
}
