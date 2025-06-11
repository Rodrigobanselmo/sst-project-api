/*
  Warnings:

  - You are about to drop the `ActonPlanRules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActionPlanRulesOnHierarchy" DROP CONSTRAINT "ActionPlanRulesOnHierarchy_action_plan_rules_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionPlanRulesOnRiskSubType" DROP CONSTRAINT "ActionPlanRulesOnRiskSubType_action_plan_rules_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionPlanRulesOnUsers" DROP CONSTRAINT "ActionPlanRulesOnUsers_action_plan_rules_id_fkey";

-- DropForeignKey
ALTER TABLE "ActonPlanRules" DROP CONSTRAINT "ActonPlanRules_workspace_id_fkey";

-- DropTable
DROP TABLE "ActonPlanRules";

-- CreateTable
CREATE TABLE "ActionPlanRules" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "is_restriction" BOOLEAN NOT NULL DEFAULT false,
    "is_all_hierarchies" BOOLEAN NOT NULL DEFAULT false,
    "risk_types" "RiskFactorsEnum"[],
    "workspace_id" TEXT NOT NULL,

    CONSTRAINT "ActionPlanRules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActionPlanRules" ADD CONSTRAINT "ActionPlanRules_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnUsers" ADD CONSTRAINT "ActionPlanRulesOnUsers_action_plan_rules_id_fkey" FOREIGN KEY ("action_plan_rules_id") REFERENCES "ActionPlanRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnHierarchy" ADD CONSTRAINT "ActionPlanRulesOnHierarchy_action_plan_rules_id_fkey" FOREIGN KEY ("action_plan_rules_id") REFERENCES "ActionPlanRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnRiskSubType" ADD CONSTRAINT "ActionPlanRulesOnRiskSubType_action_plan_rules_id_fkey" FOREIGN KEY ("action_plan_rules_id") REFERENCES "ActionPlanRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
