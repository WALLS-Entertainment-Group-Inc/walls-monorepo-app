-- Accounts foundation: personal (auto-generated per user) and business (linked to organizations).
-- Safe incremental step toward account_id-based tenancy without removing user_organizations yet.

-- ---------------------------------------------------------------------------
-- Types & tables
-- ---------------------------------------------------------------------------

CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  account_type text NOT NULL CHECK (account_type IN ('personal', 'business')),
  name text NOT NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  personal_owner_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT accounts_type_shape_check CHECK (
    (
      account_type = 'personal'
      AND personal_owner_id IS NOT NULL
      AND organization_id IS NULL
    )
    OR (
      account_type = 'business'
      AND organization_id IS NOT NULL
      AND personal_owner_id IS NULL
    )
  )
);

CREATE UNIQUE INDEX accounts_one_personal_per_user_idx
  ON public.accounts (personal_owner_id)
  WHERE account_type = 'personal';

CREATE UNIQUE INDEX accounts_one_business_per_org_idx
  ON public.accounts (organization_id)
  WHERE account_type = 'business';

CREATE INDEX accounts_account_type_idx ON public.accounts (account_type);

CREATE TABLE public.account_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  is_default boolean NOT NULL DEFAULT false,
  CONSTRAINT account_users_user_id_account_id_key UNIQUE (user_id, account_id)
);

CREATE UNIQUE INDEX account_users_one_default_per_user_idx
  ON public.account_users (user_id)
  WHERE is_default = true;

CREATE INDEX account_users_account_id_idx ON public.account_users (account_id);
CREATE INDEX account_users_user_id_idx ON public.account_users (user_id);

-- ---------------------------------------------------------------------------
-- Backfill existing data (before personal-account guard triggers)
-- ---------------------------------------------------------------------------

INSERT INTO public.accounts (
  account_type,
  name,
  personal_owner_id,
  updated_at
)
SELECT
  'personal',
  COALESCE(
    NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''),
    u.email,
    'Personal Account'
  ),
  u.id,
  u.created_at
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1
  FROM public.accounts a
  WHERE a.personal_owner_id = u.id
);

INSERT INTO public.account_users (
  account_id,
  user_id,
  role,
  is_default,
  updated_at
)
SELECT
  a.id,
  a.personal_owner_id,
  'owner',
  false,
  a.created_at
FROM public.accounts a
WHERE a.account_type = 'personal'
  AND NOT EXISTS (
    SELECT 1
    FROM public.account_users au
    WHERE au.account_id = a.id
      AND au.user_id = a.personal_owner_id
  );

INSERT INTO public.accounts (
  account_type,
  name,
  organization_id,
  updated_at
)
SELECT
  'business',
  o.name,
  o.id,
  COALESCE(o.updated_at, o.created_at)
FROM public.organizations o
WHERE NOT EXISTS (
  SELECT 1
  FROM public.accounts a
  WHERE a.organization_id = o.id
);

INSERT INTO public.account_users (
  account_id,
  user_id,
  role,
  is_default,
  updated_at
)
SELECT
  a.id,
  uo.user_id,
  uo.role,
  uo.is_default,
  COALESCE(uo.updated_at, uo.created_at)
FROM public.user_organizations uo
JOIN public.accounts a
  ON a.organization_id = uo.organization_id
 AND a.account_type = 'business'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.account_users au
  WHERE au.account_id = a.id
    AND au.user_id = uo.user_id
);

-- ---------------------------------------------------------------------------
-- Personal account auto-provisioning
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_personal_account_for_user()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  account_name text;
  new_account_id uuid;
BEGIN
  account_name := COALESCE(
    NULLIF(TRIM(CONCAT(NEW.first_name, ' ', NEW.last_name)), ''),
    NEW.email,
    'Personal Account'
  );

  PERFORM set_config('app.creating_personal_account', 'true', true);

  INSERT INTO public.accounts (
    account_type,
    name,
    personal_owner_id,
    updated_at
  )
  VALUES (
    'personal',
    account_name,
    NEW.id,
    now()
  )
  RETURNING id INTO new_account_id;

  INSERT INTO public.account_users (
    account_id,
    user_id,
    role,
    is_default,
    updated_at
  )
  VALUES (
    new_account_id,
    NEW.id,
    'owner',
    false,
    now()
  );

  PERFORM set_config('app.creating_personal_account', 'false', true);

  RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_create_personal_account_for_user
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_personal_account_for_user();

-- ---------------------------------------------------------------------------
-- Guardrails: personal accounts are system-managed only
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_personal_account_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'DELETE' AND OLD.account_type = 'personal' THEN
    RAISE EXCEPTION 'Personal accounts cannot be deleted';
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.account_type = 'personal' THEN
    RAISE EXCEPTION 'Personal accounts cannot be modified';
  END IF;

  IF TG_OP = 'INSERT'
     AND NEW.account_type = 'personal'
     AND current_setting('app.creating_personal_account', true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'Personal accounts are auto-generated and cannot be created manually';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE TRIGGER trg_prevent_personal_account_changes
  BEFORE INSERT OR UPDATE OR DELETE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_personal_account_changes();

CREATE OR REPLACE FUNCTION public.prevent_personal_account_user_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  acct_type text;
BEGIN
  SELECT account_type
  INTO acct_type
  FROM public.accounts
  WHERE id = COALESCE(NEW.account_id, OLD.account_id);

  IF acct_type = 'personal'
     AND current_setting('app.creating_personal_account', true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'Personal account membership cannot be modified';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE TRIGGER trg_prevent_personal_account_user_changes
  BEFORE INSERT OR UPDATE OR DELETE ON public.account_users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_personal_account_user_changes();
