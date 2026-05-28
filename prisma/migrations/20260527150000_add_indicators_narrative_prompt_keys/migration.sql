-- Add prompt keys for indicators narrative diagnostic by mode.
-- Note: PostgreSQL enum alterations are irreversible and cannot run inside a transaction in some setups.

ALTER TYPE "SystemAiPromptKeyEnum" ADD VALUE IF NOT EXISTS 'INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_ONLY';
ALTER TYPE "SystemAiPromptKeyEnum" ADD VALUE IF NOT EXISTS 'INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_AND_QUESTIONS';

