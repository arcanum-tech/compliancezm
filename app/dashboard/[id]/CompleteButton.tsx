"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteButton({ itemId, businessId }: { itemId: string; businessId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function mark() {
    setLoading(true);
    await fetch("/api/compliance-items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button onClick={mark} disabled={loading}
      className="text-xs font-black px-3 py-1.5 rounded-full text-white shrink-0 disabled:opacity-50"
      style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
      {loading ? "..." : "✓ Done"}
    </button>
  );
}
