ALTER TABLE "_recs" ADD COLUMN "sequential_id" INT NULL;

CREATE OR REPLACE FUNCTION _recs_assign_sequential_id()
RETURNS TRIGGER AS $$
DECLARE
  next_seq INT;
BEGIN
  SELECT COALESCE(MAX(r."sequential_id"), 99) + 1 INTO next_seq
  FROM "_recs" r
  INNER JOIN "RiskFactorData" d ON NEW."B" = d."id";

  NEW."sequential_id" := next_seq;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = '_recs_sequential_id_trigger'
    ) THEN
        CREATE TRIGGER _recs_sequential_id_trigger
        BEFORE INSERT ON "_recs"
        FOR EACH ROW
        EXECUTE FUNCTION _recs_assign_sequential_id();
    END IF;
END $$;

WITH ranked AS (
    SELECT
        r."A",
        r."B",
        ROW_NUMBER() OVER (
            PARTITION BY d."companyId"
            ORDER BY r."B"
        ) + 99 AS new_seq
    FROM "_recs" r
    JOIN "RiskFactorData" d ON r."B" = d."id"
)
UPDATE "_recs" r
SET "sequential_id" = ranked.new_seq
FROM ranked
WHERE r."A" = ranked."A"
	AND r."B" = ranked."B";

