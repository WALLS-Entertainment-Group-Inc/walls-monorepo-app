-- Account-scoped OAuth connections (e.g. Meta Ads Manager for an organization account).
-- Mirrors public.user_connections but keys off WALLS accounts instead of users.
-- user_connections.account_id (provider-side id, text) maps to provider_account_id here.

CREATE TABLE public.account_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  provider text,
  service text,
  provider_account_id text,
  token_expiry timestamptz,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_payload jsonb,
  scope_hash text,
  last_token_refresh timestamptz,
  revoked_at timestamptz,
  token_version integer
);

CREATE INDEX account_connections_account_id_idx
  ON public.account_connections (account_id);

CREATE INDEX account_connections_account_provider_service_idx
  ON public.account_connections (account_id, provider, service);

CREATE INDEX account_connections_active_idx
  ON public.account_connections (account_id, provider, service, provider_account_id)
  WHERE revoked_at IS NULL;
