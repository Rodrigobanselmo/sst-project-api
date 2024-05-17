-- Create a new column named "search" in the "RiskFactors" table
ALTER TABLE "RiskFactors"
ADD COLUMN search TEXT;

-- Update the "search" column with concatenated lowercase values from "name" and "synonymous" fields
UPDATE "RiskFactors"
SET search = LOWER(CONCAT(name, ' ', array_to_string(synonymous, ' ')));

CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Remove accents from the "search" column
UPDATE "RiskFactors"
SET search = UNACCENT(search);