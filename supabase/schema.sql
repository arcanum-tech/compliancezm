-- ComplianceZM schema

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  tpin TEXT,
  pacra_number TEXT,
  business_type TEXT NOT NULL,      -- sole_trader, company, partnership, ngo
  industry TEXT,
  registration_date DATE,
  subscription_tier TEXT DEFAULT 'free',   -- free, pro
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,           -- zra, pacra, council, workers_comp, other
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',    -- pending, completed, overdue
  penalty_info TEXT,                -- what happens if missed
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
