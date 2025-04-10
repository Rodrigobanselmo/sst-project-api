-- CreateTable
CREATE TABLE "RecMedOnRiskData" (
    "rec_med_id" TEXT NOT NULL,
    "risk_data_id" TEXT NOT NULL,
    "sequential_id" INTEGER NOT NULL,

    CONSTRAINT "RecMedOnRiskData_pkey" PRIMARY KEY ("rec_med_id","risk_data_id")
);

-- AddForeignKey
ALTER TABLE "RecMedOnRiskData" ADD CONSTRAINT "RecMedOnRiskData_A_fkey" FOREIGN KEY ("rec_med_id") REFERENCES "RecMed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMedOnRiskData" ADD CONSTRAINT "RecMedOnRiskData_B_fkey" FOREIGN KEY ("risk_data_id") REFERENCES "RiskFactorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


INSERT INTO "RecMedOnRiskData" ("rec_med_id", "risk_data_id", "sequential_id")
SELECT "A", "B", "sequential_id"
FROM "_recs"
ON CONFLICT ("rec_med_id", "risk_data_id") DO NOTHING;


CREATE OR REPLACE FUNCTION _recs_assign_sequential_id()
RETURNS TRIGGER AS $$
DECLARE
  next_seq INT;
BEGIN
  SELECT COALESCE(MAX(r."sequential_id"), 99) + 1 INTO next_seq
  FROM "RecMedOnRiskData" r
  INNER JOIN "RiskFactorData" d ON NEW."risk_data_id" = d."id";

  NEW."sequential_id" := next_seq;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
