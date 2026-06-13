import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  const { item_id } = await req.json();
  if (!item_id) return NextResponse.json({ error: "item_id required" }, { status: 400 });
  await supabaseAdmin.from("compliance_items").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", item_id);
  return NextResponse.json({ ok: true });
}
