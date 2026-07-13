-- Collapse organizations into accounts: an account of type 'organization' now holds
-- the org profile directly. user_organizations is already dropped; organizations is
-- removed here. Personal accounts are unchanged.

-- ---------------------------------------------------------------------------
-- 1. Add organization profile columns to accounts
-- ---------------------------------------------------------------------------

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS icon_url text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS address_line_1 text,
  ADD COLUMN IF NOT EXISTS address_line_2 text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state_province text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS country_code text,
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 2. Migrate organization profile data into the matching account rows
-- ---------------------------------------------------------------------------

UPDATE public.accounts a
SET slug = o.slug,
    icon_url = o.icon_url,
    website = o.website,
    description = o.description,
    email = o.email,
    phone = o.phone,
    address_line_1 = o.address_line_1,
    address_line_2 = o.address_line_2,
    city = o.city,
    state_province = o.state_province,
    postal_code = o.postal_code,
    country_code = o.country_code,
    metadata = COALESCE(o.metadata, '{}'::jsonb)
FROM public.organizations o
WHERE a.organization_id = o.id;

-- ---------------------------------------------------------------------------
-- 3. Rename account type 'business' -> 'organization'
-- ---------------------------------------------------------------------------

ALTER TABLE public.accounts DROP CONSTRAINT accounts_type_shape_check;
ALTER TABLE public.accounts DROP CONSTRAINT accounts_account_type_check;

UPDATE public.accounts
SET account_type = 'organization'
WHERE account_type = 'business';

ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_account_type_check
  CHECK (account_type IN ('personal', 'organization'));

ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_type_shape_check CHECK (
    (account_type = 'personal' AND personal_owner_id IS NOT NULL)
    OR (account_type = 'organization' AND personal_owner_id IS NULL)
  );

-- ---------------------------------------------------------------------------
-- 4. Drop organization_id (FK + dependent unique index) now that data moved
-- ---------------------------------------------------------------------------

ALTER TABLE public.accounts DROP CONSTRAINT accounts_organization_id_fkey;
ALTER TABLE public.accounts DROP COLUMN organization_id;

-- Enforce unique slug across organization accounts
CREATE UNIQUE INDEX accounts_organization_slug_idx
  ON public.accounts (slug)
  WHERE account_type = 'organization' AND slug IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 5. Drop the now-unused organizations table
-- ---------------------------------------------------------------------------

DROP TABLE public.organizations;
