CREATE OR REPLACE FUNCTION set_rec_sequential_id()
RETURNS TRIGGER AS $$
DECLARE
  v_company_id TEXT;
  next_val INT;
BEGIN
  SELECT rfd."companyId" INTO v_company_id
  FROM "RiskFactorData" rfd
  WHERE rfd."id" = NEW."risk_data_id";

  SELECT COALESCE(MAX(rmord.sequential_id), 0) + 1
  INTO next_val
  FROM "RecMedOnRiskData" AS rmord
  INNER JOIN "RiskFactorData" AS rfd ON rmord."risk_data_id" = rfd."id" 
  WHERE
    rfd."companyId" = v_company_id;       

  NEW.sequential_id := next_val;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_rec_sequential_id ON "RecMedOnRiskData";

CREATE TRIGGER trg_set_rec_sequential_id
BEFORE INSERT ON "RecMedOnRiskData"
FOR EACH ROW
EXECUTE FUNCTION set_rec_sequential_id();