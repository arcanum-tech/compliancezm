import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("business_id");
  const status = searchParams.get("status");
  if (!businessId) return NextResponse.json({ error: "Missing business_id" }, { status: 400 });

  if (status === "success") {
    const expires = new Date(); expires.setMonth(expires.getMonth() + 1);
    await supabaseAdmin.from("businesses").update({ subscription_tier: "pro", subscription_expires_at: expires.toISOString() }).eq("id", businessId);
    return NextResponse.redirect(new URL(`/dashboard/${businessId}?upgraded=1`, req.url));
  }
  return NextResponse.redirect(new URL(`/dashboard/${businessId}?upgraded=0`, req.url));
}
