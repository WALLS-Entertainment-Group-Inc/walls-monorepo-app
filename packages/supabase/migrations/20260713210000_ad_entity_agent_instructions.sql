-- Per-entity natural-language instructions for the AdPilot GPT agent.
-- The external algorithm worker reads these when making budget decisions.

ALTER TABLE public.ad_entity_automation
  ADD COLUMN IF NOT EXISTS agent_instructions text,
  ADD COLUMN IF NOT EXISTS instructions_until timestamptz;

COMMENT ON COLUMN public.ad_entity_automation.agent_instructions IS
  'Operator-authored prompt instructions for the AdPilot agent (e.g. scale aggressively until ROAS floor).';

COMMENT ON COLUMN public.ad_entity_automation.instructions_until IS
  'When set, agent_instructions are ignored after this timestamp. NULL means no expiry.';
