import {
  FormIdentifierTypeEnum,
  FormPreliminaryLibraryCategoryEnum,
  FormPreliminaryLibraryQuestionTypeEnum,
  PrismaClient,
} from '@prisma/client';

type Opt = { text: string; order: number; value?: number | null };

/**
 * Templates globais (system=true, company_id=null) — seed idempotente por nome do bloco.
 */
export async function seedFormPreliminaryLibrary(prisma: PrismaClient) {
  const existingBlock = await prisma.formPreliminaryLibraryBlock.findFirst({
    where: { system: true, name: 'Bloco Demográfico Padrão', deleted_at: null },
  });
  if (existingBlock) {
    console.log('[seed] Form preliminary library already seeded, skipping.');
    return;
  }

  const questionsData: {
    name: string;
    question_text: string;
    options: Opt[];
  }[] = [
    {
      name: 'Gênero',
      question_text: 'Gênero',
      options: [
        { text: 'Masculino', order: 0, value: 0 },
        { text: 'Feminino', order: 1, value: 1 },
        { text: 'Não binário', order: 2, value: 2 },
        { text: 'Prefiro não responder', order: 3, value: 3 },
      ],
    },
    {
      name: 'Faixa etária',
      question_text: 'Faixa etária',
      options: [
        { text: 'Até 30 anos', order: 0, value: 0 },
        { text: 'De 31 a 40 anos', order: 1, value: 1 },
        { text: 'De 41 a 50 anos', order: 2, value: 2 },
        { text: 'De 51 a 60 anos', order: 3, value: 3 },
        { text: 'Acima de 60 anos', order: 4, value: 4 },
      ],
    },
    {
      name: 'Como você se declara',
      question_text: 'Como você se declara',
      options: [
        { text: 'Branco(a)', order: 0, value: 0 },
        { text: 'Negro(a) (pretos e pardos)', order: 1, value: 1 },
        { text: 'Indígena', order: 2, value: 2 },
        { text: 'Amarelo(a) (origem oriental)', order: 3, value: 3 },
        { text: 'Prefiro não responder', order: 4, value: 4 },
      ],
    },
    {
      name: 'Escolaridade',
      question_text: 'Escolaridade',
      options: [
        { text: 'Ensino Médio', order: 0, value: 0 },
        { text: 'Superior Completo', order: 1, value: 1 },
        { text: 'Especialização', order: 2, value: 2 },
        { text: 'Mestrado', order: 3, value: 3 },
        { text: 'Doutorado', order: 4, value: 4 },
      ],
    },
    {
      name: 'Tempo de empresa',
      question_text: 'Tempo de empresa',
      options: [
        { text: 'Menos de 1 ano', order: 0, value: 0 },
        { text: 'De 1 a 3 anos', order: 1, value: 1 },
        { text: 'De 4 a 6 anos', order: 2, value: 2 },
        { text: 'De 7 a 10 anos', order: 3, value: 3 },
        { text: 'Acima de 10 anos', order: 4, value: 4 },
      ],
    },
    {
      name: 'Área de atuação na empresa (macro área)',
      question_text: 'Área de atuação na empresa (macro área)',
      options: [
        { text: 'Administrativa', order: 0, value: 0 },
        { text: 'Operacional', order: 1, value: 1 },
        { text: 'Apoio / Serviços gerais', order: 2, value: 2 },
        { text: 'Gestão / Coordenação', order: 3, value: 3 },
      ],
    },
    {
      name: 'Regime de trabalho',
      question_text: 'Regime de trabalho',
      options: [
        { text: 'Presencial', order: 0, value: 0 },
        { text: 'Híbrido', order: 1, value: 1 },
        { text: 'Teletrabalho (Home Office)', order: 2, value: 2 },
      ],
    },
  ];

  const questionIds: string[] = [];

  await prisma.$transaction(async (tx) => {
    for (const q of questionsData) {
      const created = await tx.formPreliminaryLibraryQuestion.create({
        data: {
          system: true,
          company_id: null,
          name: q.name,
          question_text: q.question_text,
          question_type: FormPreliminaryLibraryQuestionTypeEnum.SINGLE_CHOICE,
          category: FormPreliminaryLibraryCategoryEnum.DEMOGRAPHIC,
          identifier_type: FormIdentifierTypeEnum.CUSTOM,
          accept_other: false,
          options: {
            create: q.options.map((o) => ({
              text: o.text,
              order: o.order,
              value: o.value ?? null,
            })),
          },
        },
      });
      questionIds.push(created.id);
    }

    const block = await tx.formPreliminaryLibraryBlock.create({
      data: {
        system: true,
        company_id: null,
        name: 'Bloco Demográfico Padrão',
        description: 'Conjunto padrão de perguntas demográficas para segmentação analítica.',
        items: {
          create: questionIds.map((library_question_id, order) => ({
            library_question_id,
            order,
          })),
        },
      },
    });

    console.log(`[seed] Form preliminary library: ${questionIds.length} questions + block ${block.id}`);
  });
}
