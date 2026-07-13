-- AdPilot account-based conversion.
-- Re-scopes every ad_* table from individual users to WALLS accounts, and from
-- user_connections to account_connections, so anyone in an account can view and
-- manage that account's ad data. All ad_* tables are empty, so columns are
-- restructured in place (no data backfill needed).
--
-- ad_budget_adjustments additionally keeps a nullable triggered_by_user_id to
-- record who manually triggered an adjustment (NULL = automated by the system).
--
-- RLS: the previous per-user policies (user_id = auth.uid()) are replaced with
-- account-membership policies backed by is_ad_account_member(), so every member
-- of an account can read/write that account's ad data.

-- ---------------------------------------------------------------------------
-- 0. Drop the existing per-user RLS policies (they depend on user_id).
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS ad_account_settings_select_own ON public.ad_account_settings;
DROP POLICY IF EXISTS ad_account_settings_insert_own ON public.ad_account_settings;
DROP POLICY IF EXISTS ad_account_settings_update_own ON public.ad_account_settings;
DROP POLICY IF EXISTS ad_account_settings_delete_own ON public.ad_account_settings;

DROP POLICY IF EXISTS ad_automation_profiles_select_own ON public.ad_automation_profiles;
DROP POLICY IF EXISTS ad_automation_profiles_insert_own ON public.ad_automation_profiles;
DROP POLICY IF EXISTS ad_automation_profiles_update_own ON public.ad_automation_profiles;
DROP POLICY IF EXISTS ad_automation_profiles_delete_own ON public.ad_automation_profiles;

DROP POLICY IF EXISTS ad_budget_adjustments_select_own ON public.ad_budget_adjustments;
DROP POLICY IF EXISTS ad_budget_adjustments_insert_own ON public.ad_budget_adjustments;
DROP POLICY IF EXISTS ad_budget_adjustments_update_own ON public.ad_budget_adjustments;
DROP POLICY IF EXISTS ad_budget_adjustments_delete_own ON public.ad_budget_adjustments;

DROP POLICY IF EXISTS ad_creative_assets_select_own ON public.ad_creative_assets;
DROP POLICY IF EXISTS ad_creative_assets_insert_own ON public.ad_creative_assets;
DROP POLICY IF EXISTS ad_creative_assets_update_own ON public.ad_creative_assets;
DROP POLICY IF EXISTS ad_creative_assets_delete_own ON public.ad_creative_assets;

DROP POLICY IF EXISTS ad_creatives_select_own ON public.ad_creatives;
DROP POLICY IF EXISTS ad_creatives_insert_own ON public.ad_creatives;
DROP POLICY IF EXISTS ad_creatives_update_own ON public.ad_creatives;
DROP POLICY IF EXISTS ad_creatives_delete_own ON public.ad_creatives;

DROP POLICY IF EXISTS ad_entities_select_own ON public.ad_entities;
DROP POLICY IF EXISTS ad_entities_insert_own ON public.ad_entities;
DROP POLICY IF EXISTS ad_entities_update_own ON public.ad_entities;
DROP POLICY IF EXISTS ad_entities_delete_own ON public.ad_entities;

DROP POLICY IF EXISTS ad_entity_automation_select_own ON public.ad_entity_automation;
DROP POLICY IF EXISTS ad_entity_automation_insert_own ON public.ad_entity_automation;
DROP POLICY IF EXISTS ad_entity_automation_update_own ON public.ad_entity_automation;
DROP POLICY IF EXISTS ad_entity_automation_delete_own ON public.ad_entity_automation;

DROP POLICY IF EXISTS ad_metrics_daily_select_own ON public.ad_metrics_daily;
DROP POLICY IF EXISTS ad_metrics_daily_insert_own ON public.ad_metrics_daily;
DROP POLICY IF EXISTS ad_metrics_daily_update_own ON public.ad_metrics_daily;
DROP POLICY IF EXISTS ad_metrics_daily_delete_own ON public.ad_metrics_daily;

DROP POLICY IF EXISTS ad_sync_state_select_own ON public.ad_sync_state;
DROP POLICY IF EXISTS ad_sync_state_insert_own ON public.ad_sync_state;
DROP POLICY IF EXISTS ad_sync_state_update_own ON public.ad_sync_state;
DROP POLICY IF EXISTS ad_sync_state_delete_own ON public.ad_sync_state;

-- ---------------------------------------------------------------------------
-- 1. Restructure columns + indexes.
-- ---------------------------------------------------------------------------
ALTER TABLE public.ad_account_settings
  DROP COLUMN user_connection_id,
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  ADD COLUMN account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX ad_account_settings_account_connection_id_key ON public.ad_account_settings (account_connection_id);
CREATE INDEX ad_account_settings_account_idx ON public.ad_account_settings (account_id);

ALTER TABLE public.ad_automation_profiles
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX ad_automation_profiles_account_default_idx ON public.ad_automation_profiles (account_id) WHERE (is_default = true);
CREATE INDEX ad_automation_profiles_account_idx ON public.ad_automation_profiles (account_id);

ALTER TABLE public.ad_budget_adjustments
  DROP COLUMN user_connection_id,
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  ADD COLUMN account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE,
  ADD COLUMN triggered_by_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL;
CREATE INDEX ad_budget_adjustments_account_created_idx ON public.ad_budget_adjustments (account_id, created_at DESC);

ALTER TABLE public.ad_creative_assets
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE;
CREATE INDEX ad_creative_assets_account_idx ON public.ad_creative_assets (account_id);

ALTER TABLE public.ad_creatives
  DROP COLUMN user_connection_id,
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  ADD COLUMN account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX ad_creatives_connection_ad_key ON public.ad_creatives (account_connection_id, provider_ad_id);
CREATE INDEX ad_creatives_account_id_idx ON public.ad_creatives (account_id);

ALTER TABLE public.ad_entities
  DROP COLUMN user_connection_id,
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  ADD COLUMN account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE;
CREATE INDEX ad_entities_connection_idx ON public.ad_entities (account_connection_id);
CREATE INDEX ad_entities_learning_status_idx ON public.ad_entities (account_connection_id, learning_status) WHERE (learning_status IS NOT NULL);
CREATE UNIQUE INDEX ad_entities_unique_provider_entity ON public.ad_entities (account_connection_id, entity_type, provider_entity_id);
CREATE INDEX ad_entities_account_id_idx ON public.ad_entities (account_id);

ALTER TABLE public.ad_entity_automation
  DROP COLUMN user_connection_id,
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  ADD COLUMN account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE;
CREATE INDEX ad_entity_automation_connection_idx ON public.ad_entity_automation (account_connection_id);
CREATE INDEX ad_entity_automation_account_idx ON public.ad_entity_automation (account_id);

ALTER TABLE public.ad_metrics_daily
  DROP COLUMN user_connection_id,
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  ADD COLUMN account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE;
CREATE INDEX ad_metrics_daily_connection_date_idx ON public.ad_metrics_daily (account_connection_id, metric_date DESC);
CREATE INDEX ad_metrics_daily_account_date_idx ON public.ad_metrics_daily (account_id, metric_date DESC);

ALTER TABLE public.ad_sync_state
  DROP COLUMN user_connection_id,
  DROP COLUMN user_id,
  ADD COLUMN account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  ADD COLUMN account_connection_id uuid NOT NULL REFERENCES public.account_connections(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX ad_sync_state_account_connection_id_key ON public.ad_sync_state (account_connection_id);
CREATE INDEX ad_sync_state_account_idx ON public.ad_sync_state (account_id);

-- ---------------------------------------------------------------------------
-- 2. Account-membership helper (SECURITY DEFINER so it can read account_users
--    without tripping that table's own RLS).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_ad_account_member(target_account_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.account_users au
    WHERE au.account_id = target_account_id
      AND au.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_ad_account_member(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_ad_account_member(uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- 3. Recreate RLS policies as account-membership policies.
-- ---------------------------------------------------------------------------
CREATE POLICY ad_account_settings_select_member ON public.ad_account_settings FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_account_settings_insert_member ON public.ad_account_settings FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_account_settings_update_member ON public.ad_account_settings FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_account_settings_delete_member ON public.ad_account_settings FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_automation_profiles_select_member ON public.ad_automation_profiles FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_automation_profiles_insert_member ON public.ad_automation_profiles FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_automation_profiles_update_member ON public.ad_automation_profiles FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_automation_profiles_delete_member ON public.ad_automation_profiles FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_budget_adjustments_select_member ON public.ad_budget_adjustments FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_budget_adjustments_insert_member ON public.ad_budget_adjustments FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_budget_adjustments_update_member ON public.ad_budget_adjustments FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_budget_adjustments_delete_member ON public.ad_budget_adjustments FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_creative_assets_select_member ON public.ad_creative_assets FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_creative_assets_insert_member ON public.ad_creative_assets FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_creative_assets_update_member ON public.ad_creative_assets FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_creative_assets_delete_member ON public.ad_creative_assets FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_creatives_select_member ON public.ad_creatives FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_creatives_insert_member ON public.ad_creatives FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_creatives_update_member ON public.ad_creatives FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_creatives_delete_member ON public.ad_creatives FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_entities_select_member ON public.ad_entities FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_entities_insert_member ON public.ad_entities FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_entities_update_member ON public.ad_entities FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_entities_delete_member ON public.ad_entities FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_entity_automation_select_member ON public.ad_entity_automation FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_entity_automation_insert_member ON public.ad_entity_automation FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_entity_automation_update_member ON public.ad_entity_automation FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_entity_automation_delete_member ON public.ad_entity_automation FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_metrics_daily_select_member ON public.ad_metrics_daily FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_metrics_daily_insert_member ON public.ad_metrics_daily FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_metrics_daily_update_member ON public.ad_metrics_daily FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_metrics_daily_delete_member ON public.ad_metrics_daily FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));

CREATE POLICY ad_sync_state_select_member ON public.ad_sync_state FOR SELECT TO authenticated USING (public.is_ad_account_member(account_id));
CREATE POLICY ad_sync_state_insert_member ON public.ad_sync_state FOR INSERT TO authenticated WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_sync_state_update_member ON public.ad_sync_state FOR UPDATE TO authenticated USING (public.is_ad_account_member(account_id)) WITH CHECK (public.is_ad_account_member(account_id));
CREATE POLICY ad_sync_state_delete_member ON public.ad_sync_state FOR DELETE TO authenticated USING (public.is_ad_account_member(account_id));
