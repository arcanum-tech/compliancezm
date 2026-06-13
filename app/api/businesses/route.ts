import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });
  const normalized = phone.replace(/\s+/g, "").replace(/^\+26/, "0").replace(/^26/, "0");
  const { data } = await supabase.from("businesses").select("id").eq("phone", normalized).single();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: data.id });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, owner_name, phone, email, tpin, pacra_number, business_type, industry, registration_date } = body;
  if (!name || !owner_name || !phone) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const normalized = phone.replace(/\s+/g, "").replace(/^\+26/, "0").replace(/^26/, "0");
  const { data: existing } = await supabaseAdmin.from("businesses").select("id").eq("phone", normalized).single();
  if (existing) return NextResponse.json({ id: existing.id });

  const { data, error } = await supabaseAdmin.from("businesses").insert({
    name, owner_name, phone: normalized, email, tpin, pacra_number,
    business_type, industry, registration_date: registration_date || null,
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-generate compliance checklist based on business type
  await generateChecklist(data.id, business_type, registration_date);

  return NextResponse.json({ id: data.id });
}

async function generateChecklist(businessId: string, type: string, regDate: string) {
  const now = new Date();
  const items = [];

  // ZRA — quarterly VAT (every business with TPIN)
  for (let q = 0; q < 4; q++) {
    const due = new Date(now.getFullYear(), (Math.floor(now.getMonth() / 3) + q) * 3 + 2, 20);
    items.push({ business_id: businessId, title: `ZRA VAT Return Q${q + 1}`, category: "zra", due_date: due.toISOString().split("T")[0], penalty_info: "Penalty: ZMW 5,000 + interest on late VAT returns" });
  }

  // PACRA annual return
  if (type === "company" || type === "partnership") {
    const dueAnnual = new Date(now.getFullYear(), 2, 31); // March 31
    items.push({ business_id: businessId, title: "PACRA Annual Return", category: "pacra", due_date: dueAnnual.toISOString().split("T")[0], penalty_info: "Penalty: ZMW 500–2,000 for late annual returns" });
  }

  // LCC business licence renewal — annual
  items.push({ business_id: businessId, title: "Business Licence Renewal (LCC)", category: "council", due_date: new Date(now.getFullYear(), 0, 31).toISOString().split("T")[0], penalty_info: "Operating without a valid licence is an offence" });

  // NAPSA — monthly
  const napsa = new Date(now.getFullYear(), now.getMonth() + 1, 10);
  items.push({ business_id: businessId, title: "NAPSA Monthly Contribution", category: "napsa", due_date: napsa.toISOString().split("T")[0], penalty_info: "Penalty interest on late NAPSA contributions" });

  // NHIMA
  const nhima = new Date(now.getFullYear(), now.getMonth() + 1, 15);
  items.push({ business_id: businessId, title: "NHIMA Monthly Contribution", category: "nhima", due_date: nhima.toISOString().split("T")[0], penalty_info: "Non-compliance may result in employee benefit loss" });

  if (items.length) await supabaseAdmin.from("compliance_items").insert(items);
}
