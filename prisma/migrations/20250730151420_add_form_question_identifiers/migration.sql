-- Insert FormQuestionIdentifier records for each FormIdentifierTypeEnum value
-- System-level identifiers (direct_association = true)
INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") VALUES
('cmdq3yd9b000008icgnsybiyg', 'EMAIL', true, true, NOW(), NOW()),
('cmdq3yme4000008lafv43b9hc', 'CPF', true, true, NOW(), NOW()),
('cmdq3ysfy000108la0dxr51vz', 'AGE', true, true, NOW(), NOW()),
('cmdq3ywvt000208la8sqt9lc3', 'SEX', true, true, NOW(), NOW());

-- Hierarchy-related identifiers (direct_association = false)
INSERT INTO "FormQuestionIdentifier" ("id", "type", "system", "direct_association", "created_at", "updated_at") VALUES
('cmdq3yzp3000308la7r6vh867', 'WORKSPACE', true, false, NOW(), NOW()),
('cmdq3z32w000408lag6yn6i5k', 'DIRECTORY', true, false, NOW(), NOW()),
('cmdq3z6eh000508la9drb9zyz', 'MANAGEMENT', true, false, NOW(), NOW()),
('cmdq3zafk000608la9r351uty', 'SECTOR', true, false, NOW(), NOW()),
('cmdq3zdg0000708la0xlp8dbx', 'SUB_SECTOR', true, false, NOW(), NOW()),
('cmdq3zfyu000808lahnnj4y95', 'OFFICE', true, false, NOW(), NOW()),
('cmdq3zjh3000908la4u8d2rny', 'SUB_OFFICE', true, false, NOW(), NOW()),
('cmdq3zn6e000008jfccxgehh5', 'CUSTOM', true, false, NOW(), NOW());