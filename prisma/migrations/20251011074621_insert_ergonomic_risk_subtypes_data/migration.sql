-- Insert new ergonomic risk subtypes
INSERT INTO "RiskSubType" (name, type, sub_type, created_at, updated_at) VALUES
('Ambientais', 'ERG', 'AMBIENTAIS', NOW(), NOW()),
('Biomecânicos', 'ERG', 'BIOMECANICOS', NOW(), NOW()),
('Mobiliário e Equipamentos', 'ERG', 'MOBILIARIO_EQUIPAMENTOS', NOW(), NOW()),
('Organizacionais', 'ERG', 'ORGANIZACIONAIS', NOW(), NOW());

-- Insert new "OUTROS" risk subtypes
INSERT INTO "RiskSubType" (name, type, sub_type, created_at, updated_at) VALUES
('Indicadores de Saúde', 'OUTROS', 'INDICADORES_SAUDE', NOW(), NOW()),
('Indicadores de Controles', 'OUTROS', 'INDICADORES_CONTROLES', NOW(), NOW());
