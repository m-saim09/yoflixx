create extension if not exists "pgcrypto";

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  name text not null default 'Admin',
  role text not null default 'admin' check (role in ('admin', 'manager')),
  is_active boolean not null default true,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  status text not null default 'New' check (status in ('New', 'Read', 'Replied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  company_name text not null,
  selected_plan text not null,
  project_type text not null,
  budget text not null,
  timeline text not null,
  message text not null,
  requirements text not null default '',
  status text not null default 'New',
  is_read boolean not null default false,
  source text not null default 'Website Inquiry',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pricing_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  price text not null,
  billing_type text not null default 'project',
  features text[] not null default '{}',
  button_text text not null default 'Choose Plan',
  badge text not null default '',
  is_popular boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists website_settings (
  id uuid primary key default gen_random_uuid(),
  business_info jsonb not null default '{}'::jsonb,
  hero_section jsonb not null default '{}'::jsonb,
  about_section jsonb not null default '{}'::jsonb,
  contact_info jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  branding jsonb not null default '{}'::jsonb,
  seo_settings jsonb not null default '{}'::jsonb,
  services jsonb not null default '[]'::jsonb,
  case_studies jsonb not null default '[]'::jsonb,
  content_sections jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contacts_created_at on contacts (created_at desc);
create index if not exists idx_leads_created_at on leads (created_at desc);
create index if not exists idx_leads_status_plan on leads (status, selected_plan);
create index if not exists idx_pricing_active_order on pricing_plans (is_active, "order");
