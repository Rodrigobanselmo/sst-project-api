-- Seed Form Preliminary Library with default demographic questions and block
-- This migration inserts system-level (system=true, company_id=null) questions and a block
-- Only inserts if the block doesn't already exist

DO $$
DECLARE
  v_block_exists BOOLEAN;
  v_question_genero_id UUID;
  v_question_faixa_etaria_id UUID;
  v_question_raca_id UUID;
  v_question_escolaridade_id UUID;
  v_question_tempo_empresa_id UUID;
  v_question_area_atuacao_id UUID;
  v_question_regime_trabalho_id UUID;
  v_block_id UUID;
BEGIN
  -- Check if the block already exists
  SELECT EXISTS (
    SELECT 1 FROM "form_preliminary_library_block"
    WHERE system = true
      AND name = 'Bloco Demográfico Padrão'
      AND deleted_at IS NULL
  ) INTO v_block_exists;

  -- Only proceed if block doesn't exist
  IF NOT v_block_exists THEN
    -- Generate deterministic UUIDs for questions
    v_question_genero_id := gen_random_uuid();
    v_question_faixa_etaria_id := gen_random_uuid();
    v_question_raca_id := gen_random_uuid();
    v_question_escolaridade_id := gen_random_uuid();
    v_question_tempo_empresa_id := gen_random_uuid();
    v_question_area_atuacao_id := gen_random_uuid();
    v_question_regime_trabalho_id := gen_random_uuid();
    v_block_id := gen_random_uuid();

    -- Insert Question 1: Gênero
    INSERT INTO "form_preliminary_library_question" (
      id, system, company_id, name, question_text, question_type, category,
      identifier_type, accept_other, created_at, updated_at, deleted_at
    ) VALUES (
      v_question_genero_id, true, NULL, 'Gênero', 'Gênero',
      'SINGLE_CHOICE', 'DEMOGRAPHIC', 'CUSTOM', false, NOW(), NOW(), NULL
    );

    -- Insert options for Gênero
    INSERT INTO "form_preliminary_library_question_option" (id, library_question_id, text, "order", value, created_at, updated_at, deleted_at)
    VALUES
      (gen_random_uuid(), v_question_genero_id, 'Masculino', 0, 0, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_genero_id, 'Feminino', 1, 1, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_genero_id, 'Não binário', 2, 2, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_genero_id, 'Prefiro não responder', 3, 3, NOW(), NOW(), NULL);

    -- Insert Question 2: Faixa etária
    INSERT INTO "form_preliminary_library_question" (
      id, system, company_id, name, question_text, question_type, category,
      identifier_type, accept_other, created_at, updated_at, deleted_at
    ) VALUES (
      v_question_faixa_etaria_id, true, NULL, 'Faixa etária', 'Faixa etária',
      'SINGLE_CHOICE', 'DEMOGRAPHIC', 'CUSTOM', false, NOW(), NOW(), NULL
    );

    -- Insert options for Faixa etária
    INSERT INTO "form_preliminary_library_question_option" (id, library_question_id, text, "order", value, created_at, updated_at, deleted_at)
    VALUES
      (gen_random_uuid(), v_question_faixa_etaria_id, 'Até 30 anos', 0, 0, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_faixa_etaria_id, 'De 31 a 40 anos', 1, 1, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_faixa_etaria_id, 'De 41 a 50 anos', 2, 2, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_faixa_etaria_id, 'De 51 a 60 anos', 3, 3, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_faixa_etaria_id, 'Acima de 60 anos', 4, 4, NOW(), NOW(), NULL);

    -- Insert Question 3: Como você se declara
    INSERT INTO "form_preliminary_library_question" (
      id, system, company_id, name, question_text, question_type, category,
      identifier_type, accept_other, created_at, updated_at, deleted_at
    ) VALUES (
      v_question_raca_id, true, NULL, 'Como você se declara', 'Como você se declara',
      'SINGLE_CHOICE', 'DEMOGRAPHIC', 'CUSTOM', false, NOW(), NOW(), NULL
    );

    -- Insert options for Como você se declara
    INSERT INTO "form_preliminary_library_question_option" (id, library_question_id, text, "order", value, created_at, updated_at, deleted_at)
    VALUES
      (gen_random_uuid(), v_question_raca_id, 'Branco(a)', 0, 0, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_raca_id, 'Negro(a) (pretos e pardos)', 1, 1, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_raca_id, 'Indígena', 2, 2, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_raca_id, 'Amarelo(a) (origem oriental)', 3, 3, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_raca_id, 'Prefiro não responder', 4, 4, NOW(), NOW(), NULL);

    -- Insert Question 4: Escolaridade
    INSERT INTO "form_preliminary_library_question" (
      id, system, company_id, name, question_text, question_type, category,
      identifier_type, accept_other, created_at, updated_at, deleted_at
    ) VALUES (
      v_question_escolaridade_id, true, NULL, 'Escolaridade', 'Escolaridade',
      'SINGLE_CHOICE', 'DEMOGRAPHIC', 'CUSTOM', false, NOW(), NOW(), NULL
    );

    -- Insert options for Escolaridade
    INSERT INTO "form_preliminary_library_question_option" (id, library_question_id, text, "order", value, created_at, updated_at, deleted_at)
    VALUES
      (gen_random_uuid(), v_question_escolaridade_id, 'Ensino Médio', 0, 0, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_escolaridade_id, 'Superior Completo', 1, 1, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_escolaridade_id, 'Especialização', 2, 2, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_escolaridade_id, 'Mestrado', 3, 3, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_escolaridade_id, 'Doutorado', 4, 4, NOW(), NOW(), NULL);

    -- Insert Question 5: Tempo de empresa
    INSERT INTO "form_preliminary_library_question" (
      id, system, company_id, name, question_text, question_type, category,
      identifier_type, accept_other, created_at, updated_at, deleted_at
    ) VALUES (
      v_question_tempo_empresa_id, true, NULL, 'Tempo de empresa', 'Tempo de empresa',
      'SINGLE_CHOICE', 'DEMOGRAPHIC', 'CUSTOM', false, NOW(), NOW(), NULL
    );

    -- Insert options for Tempo de empresa
    INSERT INTO "form_preliminary_library_question_option" (id, library_question_id, text, "order", value, created_at, updated_at, deleted_at)
    VALUES
      (gen_random_uuid(), v_question_tempo_empresa_id, 'Menos de 1 ano', 0, 0, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_tempo_empresa_id, 'De 1 a 3 anos', 1, 1, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_tempo_empresa_id, 'De 4 a 6 anos', 2, 2, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_tempo_empresa_id, 'De 7 a 10 anos', 3, 3, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_tempo_empresa_id, 'Acima de 10 anos', 4, 4, NOW(), NOW(), NULL);

    -- Insert Question 6: Área de atuação na empresa (macro área)
    INSERT INTO "form_preliminary_library_question" (
      id, system, company_id, name, question_text, question_type, category,
      identifier_type, accept_other, created_at, updated_at, deleted_at
    ) VALUES (
      v_question_area_atuacao_id, true, NULL, 'Área de atuação na empresa (macro área)',
      'Área de atuação na empresa (macro área)', 'SINGLE_CHOICE', 'DEMOGRAPHIC', 'CUSTOM', false, NOW(), NOW(), NULL
    );

    -- Insert options for Área de atuação
    INSERT INTO "form_preliminary_library_question_option" (id, library_question_id, text, "order", value, created_at, updated_at, deleted_at)
    VALUES
      (gen_random_uuid(), v_question_area_atuacao_id, 'Administrativa', 0, 0, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_area_atuacao_id, 'Operacional', 1, 1, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_area_atuacao_id, 'Apoio / Serviços gerais', 2, 2, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_area_atuacao_id, 'Gestão / Coordenação', 3, 3, NOW(), NOW(), NULL);

    -- Insert Question 7: Regime de trabalho
    INSERT INTO "form_preliminary_library_question" (
      id, system, company_id, name, question_text, question_type, category,
      identifier_type, accept_other, created_at, updated_at, deleted_at
    ) VALUES (
      v_question_regime_trabalho_id, true, NULL, 'Regime de trabalho', 'Regime de trabalho',
      'SINGLE_CHOICE', 'DEMOGRAPHIC', 'CUSTOM', false, NOW(), NOW(), NULL
    );

    -- Insert options for Regime de trabalho
    INSERT INTO "form_preliminary_library_question_option" (id, library_question_id, text, "order", value, created_at, updated_at, deleted_at)
    VALUES
      (gen_random_uuid(), v_question_regime_trabalho_id, 'Presencial', 0, 0, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_regime_trabalho_id, 'Híbrido', 1, 1, NOW(), NOW(), NULL),
      (gen_random_uuid(), v_question_regime_trabalho_id, 'Teletrabalho (Home Office)', 2, 2, NOW(), NOW(), NULL);

    -- Insert Block: Bloco Demográfico Padrão
    INSERT INTO "form_preliminary_library_block" (
      id, system, company_id, name, description, created_at, updated_at, deleted_at
    ) VALUES (
      v_block_id, true, NULL, 'Bloco Demográfico Padrão',
      'Conjunto padrão de perguntas demográficas para segmentação analítica.',
      NOW(), NOW(), NULL
    );

    -- Insert Block Items (linking questions to the block)
    INSERT INTO "form_preliminary_library_block_item" (id, block_id, library_question_id, "order")
    VALUES
      (gen_random_uuid(), v_block_id, v_question_genero_id, 0),
      (gen_random_uuid(), v_block_id, v_question_faixa_etaria_id, 1),
      (gen_random_uuid(), v_block_id, v_question_raca_id, 2),
      (gen_random_uuid(), v_block_id, v_question_escolaridade_id, 3),
      (gen_random_uuid(), v_block_id, v_question_tempo_empresa_id, 4),
      (gen_random_uuid(), v_block_id, v_question_area_atuacao_id, 5),
      (gen_random_uuid(), v_block_id, v_question_regime_trabalho_id, 6);

    RAISE NOTICE 'Form preliminary library seeded: 7 questions + 1 block';
  ELSE
    RAISE NOTICE 'Form preliminary library already exists, skipping seed';
  END IF;
END $$;
