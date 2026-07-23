-- Remove free-text notes from AdPilot budget objectives.

ALTER TABLE public.ad_budget_objectives
  DROP COLUMN IF EXISTS notes;
