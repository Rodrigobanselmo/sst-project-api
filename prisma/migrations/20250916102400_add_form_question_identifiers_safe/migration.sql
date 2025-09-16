-- CreateFormQuestionIdentifiers
-- This migration safely inserts FormQuestionIdentifier records, avoiding duplicates by checking both ID and type

-- Direct association identifiers (direct_association = true)
INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3yd9b000008icgnsybiyg', 'EMAIL', true, true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3yd9b000008icgnsybiyg' OR "type" = 'EMAIL'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3yme4000008lafv43b9hc', 'CPF', true, true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3yme4000008lafv43b9hc' OR "type" = 'CPF'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3ysfy000108la0dxr51vz', 'AGE', true, true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3ysfy000108la0dxr51vz' OR "type" = 'AGE'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3ywvt000208la8sqt9lc3', 'SEX', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3ywvt000208la8sqt9lc3' OR "type" = 'SEX'
);

-- Hierarchy-related identifiers (direct_association = false)
INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3yzp3000308la7r6vh867', 'WORKSPACE', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3yzp3000308la7r6vh867' OR "type" = 'WORKSPACE'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3z32w000408lag6yn6i5k', 'DIRECTORY', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3z32w000408lag6yn6i5k' OR "type" = 'DIRECTORY'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3z6eh000508la9drb9zyz', 'MANAGEMENT', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3z6eh000508la9drb9zyz' OR "type" = 'MANAGEMENT'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3zafk000608la9r351uty', 'SECTOR', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3zafk000608la9r351uty' OR "type" = 'SECTOR'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3zdg0000708la0xlp8dbx', 'SUB_SECTOR', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3zdg0000708la0xlp8dbx' OR "type" = 'SUB_SECTOR'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3zfyu000808lahnnj4y95', 'OFFICE', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3zfyu000808lahnnj4y95' OR "type" = 'OFFICE'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3zjh3000908la4u8d2rny', 'SUB_OFFICE', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3zjh3000908la4u8d2rny' OR "type" = 'SUB_OFFICE'
);

INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") 
SELECT 'cmdq3zn6e000008jfccxgehh5', 'CUSTOM', true, false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "FormQuestionIdentifier" 
    WHERE "id" = 'cmdq3zn6e000008jfccxgehh5' OR "type" = 'CUSTOM'
);
