-- Remove primary-objective distinction from AdPilot budget objectives.
-- All objectives are equal; period narrative focus remains on ad_budget_periods.primary_focus.

DROP INDEX IF EXISTS public.ad_budget_objectives_one_primary_per_period_idx;

DROP INDEX IF EXISTS public.ad_budget_objectives_period_idx;

CREATE INDEX IF NOT EXISTS ad_budget_objectives_period_idx
  ON public.ad_budget_objectives (period_id, priority, created_at);

ALTER TABLE public.ad_budget_objectives
  DROP COLUMN IF EXISTS is_primary;
