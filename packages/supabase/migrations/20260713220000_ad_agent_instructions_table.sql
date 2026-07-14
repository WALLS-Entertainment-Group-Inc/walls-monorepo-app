-- Move AdPilot agent instructions off ad_entity_automation and into a dedicated
-- table so an entity can have multiple, independently-scheduled instruction
-- windows (each with an optional start + end timestamp).

-- 1. Drop the single-instruction columns added in the previous migration.
ALTER TABLE public.ad_entity_automation
  DROP COLUMN IF EXISTS agent_instructions,
  DROP COLUMN IF EXISTS instructions_until;

-- 2. Dedicated instructions table.
CREATE TABLE IF NOT EXISTS public.ad_agent_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES public.ad_entities(id) ON DELETE CASCADE,
  instructions text NOT NULL,
  -- NULL starts_at = effective immediately; NULL ends_at = no expiry.
  starts_at timestamptz,
  ends_at timestamptz,
  -- Manual on/off, independent of the schedule window.
  is_active boolean NOT NULL DEFAULT true,
  created_by_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT ad_agent_instructions_window_check
    CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at),
  CONSTRAINT ad_agent_instructions_not_blank
    CHECK (length(btrim(instructions)) > 0)
);

CREATE INDEX ad_agent_instructions_entity_idx
  ON public.ad_agent_instructions (entity_id);
CREATE INDEX ad_agent_instructions_account_idx
  ON public.ad_agent_instructions (account_id);
CREATE INDEX ad_agent_instructions_window_idx
  ON public.ad_agent_instructions (entity_id, starts_at, ends_at)
  WHERE (is_active = true);

COMMENT ON TABLE public.ad_agent_instructions IS
  'Operator-authored natural-language instructions for the AdPilot agent, scoped to a campaign/ad set with an optional schedule window.';
COMMENT ON COLUMN public.ad_agent_instructions.starts_at IS
  'When the instruction becomes active. NULL = effective immediately (supports future scheduling).';
COMMENT ON COLUMN public.ad_agent_instructions.ends_at IS
  'When the instruction stops applying. NULL = no expiry.';
COMMENT ON COLUMN public.ad_agent_instructions.is_active IS
  'Manual enable/disable switch, evaluated in addition to the schedule window.';

-- 3. RLS — account-member scoped, mirroring the other ad_* tables.
ALTER TABLE public.ad_agent_instructions ENABLE ROW LEVEL SECURITY;

CREATE POLICY ad_agent_instructions_select_member ON public.ad_agent_instructions
  FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_agent_instructions_insert_member ON public.ad_agent_instructions
  FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_agent_instructions_update_member ON public.ad_agent_instructions
  FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_agent_instructions_delete_member ON public.ad_agent_instructions
  FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));
