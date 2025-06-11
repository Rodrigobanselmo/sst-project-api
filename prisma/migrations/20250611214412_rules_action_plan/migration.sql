-- CreateTable
CREATE TABLE "ActonPlanRules" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "is_restriction" BOOLEAN NOT NULL DEFAULT false,
    "is_all_hierarchies" BOOLEAN NOT NULL DEFAULT false,
    "risk_types" "RiskFactorsEnum"[],
    "workspace_id" TEXT NOT NULL,

    CONSTRAINT "ActonPlanRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionPlanRulesOnUsers" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_plan_rules_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "ActionPlanRulesOnUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionPlanRulesOnHierarchy" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_plan_rules_id" INTEGER NOT NULL,
    "hierarchy_id" TEXT NOT NULL,

    CONSTRAINT "ActionPlanRulesOnHierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionPlanRulesOnRiskSubType" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_plan_rules_id" INTEGER NOT NULL,
    "risk_sub_type_id" INTEGER NOT NULL,

    CONSTRAINT "ActionPlanRulesOnRiskSubType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionPlanRulesOnUsers_action_plan_rules_id_user_id_key" ON "ActionPlanRulesOnUsers"("action_plan_rules_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ActionPlanRulesOnHierarchy_action_plan_rules_id_hierarchy_i_key" ON "ActionPlanRulesOnHierarchy"("action_plan_rules_id", "hierarchy_id");

-- CreateIndex
CREATE UNIQUE INDEX "ActionPlanRulesOnRiskSubType_action_plan_rules_id_risk_sub__key" ON "ActionPlanRulesOnRiskSubType"("action_plan_rules_id", "risk_sub_type_id");

-- AddForeignKey
ALTER TABLE "ActonPlanRules" ADD CONSTRAINT "ActonPlanRules_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnUsers" ADD CONSTRAINT "ActionPlanRulesOnUsers_action_plan_rules_id_fkey" FOREIGN KEY ("action_plan_rules_id") REFERENCES "ActonPlanRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnUsers" ADD CONSTRAINT "ActionPlanRulesOnUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnHierarchy" ADD CONSTRAINT "ActionPlanRulesOnHierarchy_action_plan_rules_id_fkey" FOREIGN KEY ("action_plan_rules_id") REFERENCES "ActonPlanRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnHierarchy" ADD CONSTRAINT "ActionPlanRulesOnHierarchy_hierarchy_id_fkey" FOREIGN KEY ("hierarchy_id") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnRiskSubType" ADD CONSTRAINT "ActionPlanRulesOnRiskSubType_action_plan_rules_id_fkey" FOREIGN KEY ("action_plan_rules_id") REFERENCES "ActonPlanRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlanRulesOnRiskSubType" ADD CONSTRAINT "ActionPlanRulesOnRiskSubType_risk_sub_type_id_fkey" FOREIGN KEY ("risk_sub_type_id") REFERENCES "RiskSubType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
