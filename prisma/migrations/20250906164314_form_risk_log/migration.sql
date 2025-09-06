-- CreateTable
CREATE TABLE "FormApplicationRiskLog" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "form_application_id" TEXT NOT NULL,
    "risk_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "probability" INTEGER NOT NULL,

    CONSTRAINT "FormApplicationRiskLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormApplicationRiskLog" ADD CONSTRAINT "FormApplicationRiskLog_form_application_id_fkey" FOREIGN KEY ("form_application_id") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplicationRiskLog" ADD CONSTRAINT "FormApplicationRiskLog_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "RiskFactors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
