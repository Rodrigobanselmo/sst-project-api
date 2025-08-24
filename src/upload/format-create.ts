import { FormQuestionCOPSOQEntity } from '@/@v2/forms/domain/entities/form-question-copsoq.entity';
import { FormQuestionDetailsEntity } from '@/@v2/forms/domain/entities/form-question-details.entity';
import { FormQuestionGroupEntity } from '@/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';
import { FormQuestionRiskEntity } from '@/@v2/forms/domain/entities/form-question-risk.entity';
import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { FormEntity } from '@/@v2/forms/domain/entities/form.entity';
import { FormCOPSOQCategoryEnum } from '@/@v2/forms/domain/enums/form-copsoq-category.enum';
import { FormCOPSOQDimensionEnum } from '@/@v2/forms/domain/enums/form-copsoq-dimension.enum';
import { FormCOPSOQLevelEnum } from '@/@v2/forms/domain/enums/form-copsoq-level.enum';
import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { simpleCompanyId } from '@/shared/constants/ids';
import { asyncBatch } from '@/shared/utils/asyncBatch';
import { PrismaClient, RiskSubTypeEnum } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

interface Item {
  Categoria: string;
  Dimensão: string;
  'Nome do Item': string;
  Nível: string;
  Nº: string;
  'Pergunta Traduzida': string;
  'Pergunta Aplicada': string;
  TIPO: string;
  Proprocionalidade: string;
  'Opções 1': string;
  'Opções 2': string;
  'Opções 3': string;
  'Opções 4': string;
  'Opções 5': string;
  'Opsões Originais': string;
  'Fator de Risco': string;
  Severidade: string;
}

type CategoryRecordMapping = Record<string, FormCOPSOQCategoryEnum>;
type DimensionRecordMapping = Record<string, FormCOPSOQDimensionEnum>;
type LevelRecordMapping = Record<string, FormCOPSOQLevelEnum>;

export const categoryMapper: CategoryRecordMapping = {
  'COMPORTAMENTOS OFENSIVOS': FormCOPSOQCategoryEnum.COMPORTAMENTOS_OFENSIVOS,
  'EXIGÊNCIAS LABORAIS': FormCOPSOQCategoryEnum.EXIGENCIAS_LABORAIS,
  'INTERFACE TRABALHO-INDIVÍDUO': FormCOPSOQCategoryEnum.INTERFACE_TRABALHO_INDIVIDUO,
  'ORGANIZAÇÃO DO TRABALHO E CONTEÚDO': FormCOPSOQCategoryEnum.ORGANIZACAO_DO_TRABALHO_E_CONTEUDO,
  PERSONALIDADE: FormCOPSOQCategoryEnum.PERSONALIDADE,
  'RELAÇÕES SOCIAIS E LIDERANÇA': FormCOPSOQCategoryEnum.RELACOES_SOCIAIS_E_LIDERANCA,
  'SAÚDE E BEM-ESTAR': FormCOPSOQCategoryEnum.SAUDE_E_BEM_ESTAR,
  'VALORES NO LOCAL DE TRABALHO': FormCOPSOQCategoryEnum.VALORES_NO_LOCAL_DE_TRABALHO,
};

export const dimensionMapper: DimensionRecordMapping = {
  // Mapeando as strings originais da segunda imagem para o enum de Dimensões
  'Comportamentos Ofensivos': FormCOPSOQDimensionEnum.COMPORTAMENTOS_OFENSIVOS,
  'Ameaças de Violência': FormCOPSOQDimensionEnum.AMEACAS_DE_VIOLENCIA,
  'Assédio Sexual': FormCOPSOQDimensionEnum.ASSEDIO_SEXUAL,
  'Assédio Virtual': FormCOPSOQDimensionEnum.ASSEDIO_VIRTUAL,
  'Atos Negativos': FormCOPSOQDimensionEnum.ATOS_NEGATIVOS,
  'Provocações Desagradáveis': FormCOPSOQDimensionEnum.PROVOCACOES_DESAGRADAVEIS,
  Bullying: FormCOPSOQDimensionEnum.BULLYING,
  'Conflitos e Desentendimentos': FormCOPSOQDimensionEnum.CONFLITOS_E_DESENTENDIMENTOS,
  'Violência Física': FormCOPSOQDimensionEnum.VIOLENCIA_FISICA,
  'Exigências Quantitativas': FormCOPSOQDimensionEnum.EXIGENCIAS_QUANTITATIVAS,
  'Ritmo de Trabalho': FormCOPSOQDimensionEnum.RITMO_DE_TRABALHO,
  'Demandas Cognitivas': FormCOPSOQDimensionEnum.DEMANDAS_COGNITIVAS,
  'Demandas Emocionais': FormCOPSOQDimensionEnum.DEMANDAS_EMOCIONAIS,
  'Demandas para Esconder Emoções': FormCOPSOQDimensionEnum.DEMANDAS_PARA_ESCONDER_EMOCOES,
  'Satisfação no Trabalho': FormCOPSOQDimensionEnum.SATISFACAO_NO_TRABALHO,
  'Insegurança no Trabalho': FormCOPSOQDimensionEnum.INSEGURANCA_NO_TRABALHO,
  'Conflito Trabalho-Família': FormCOPSOQDimensionEnum.CONFLITO_TRABALHO_FAMILIA,
  'Insegurança sobre Condições de Trabalho': FormCOPSOQDimensionEnum.INSEGURANCA_SOBRE_CONDICOES_DE_TRABALHO,
  'Qualidade do Trabalho': FormCOPSOQDimensionEnum.QUALIDADE_DO_TRABALHO,
  'Controle sobre o Tempo de Trabalho': FormCOPSOQDimensionEnum.CONTROLE_SOBRE_O_TEMPO_DE_TRABALHO,
  'Influência no Trabalho': FormCOPSOQDimensionEnum.INFLUENCIA_NO_TRABALHO,
  'Possibilidades de Desenvolvimento': FormCOPSOQDimensionEnum.POSSIBILIDADES_DE_DESENVOLVIMENTO,
  'Significado do Trabalho': FormCOPSOQDimensionEnum.SIGNIFICADO_DO_TRABALHO,
  'Engajamento no Trabalho': FormCOPSOQDimensionEnum.ENGAJAMENTO_NO_TRABALHO,
  'Compromisso Face ao Local de Trabalho': FormCOPSOQDimensionEnum.COMPROMISSO_FACE_AO_LOCAL_DE_TRABALHO,
  'Variedade de Trabalho': FormCOPSOQDimensionEnum.VARIEDADE_DE_TRABALHO,
  Autoeficácia: FormCOPSOQDimensionEnum.AUTOEFICACIA,
  Previsibilidade: FormCOPSOQDimensionEnum.PREVISIBILIDADE,
  'Transparência de Papel': FormCOPSOQDimensionEnum.TRANSPARENCIA_DE_PAPEL,
  Recompensas: FormCOPSOQDimensionEnum.RECOMPENSAS,
  'Conflitos Laborais': FormCOPSOQDimensionEnum.CONFLITOS_LABORAIS,
  'Tarefas Ilegítimas': FormCOPSOQDimensionEnum.TAREFAS_ILEGITIMAS, // Atenção à grafia original "llegítimas"
  'Apoio Social de Colegas': FormCOPSOQDimensionEnum.APOIO_SOCIAL_DE_COLEGAS,
  'Apoio Social de Superiores': FormCOPSOQDimensionEnum.APOIO_SOCIAL_DE_SUPERIORES,
  'Qualidade da Chefia': FormCOPSOQDimensionEnum.QUALIDADE_DA_CHEFIA,
  'Saúde Geral': FormCOPSOQDimensionEnum.SAUDE_GERAL,
  'Problemas em dormir': FormCOPSOQDimensionEnum.PROBLEMAS_EM_DORMIR,
  Burnout: FormCOPSOQDimensionEnum.BURNOUT,
  Estresse: FormCOPSOQDimensionEnum.ESTRESSE,
  'Sintomas Depressivos': FormCOPSOQDimensionEnum.SINTOMAS_DEPRESSIVOS,
  'Estresse Cognitivo': FormCOPSOQDimensionEnum.ESTRESSE_COGNITIVO,
  'Estresse Somático': FormCOPSOQDimensionEnum.ESTRESSE_SOMATICO,
  'Sentido de Comunidade Social no Trabalho': FormCOPSOQDimensionEnum.SENTIDO_DE_COMUNIDADE_SOCIAL_NO_TRABALHO,
  'Sentido  de Comunidade Social no Trabalho': FormCOPSOQDimensionEnum.SENTIDO_DE_COMUNIDADE_SOCIAL_NO_TRABALHO,
  'Confiança Horizontal': FormCOPSOQDimensionEnum.CONFIANCA_HORIZONTAL,
  'Confiança Vertical': FormCOPSOQDimensionEnum.CONFIANCA_VERTICAL,
  'Justiça e Respeito Organizacional': FormCOPSOQDimensionEnum.JUSTICA_E_RESPEITO_ORGANIZACIONAL,
};

export const levelMapper: LevelRecordMapping = {
  Curto: FormCOPSOQLevelEnum.SHORT,
  Médio: FormCOPSOQLevelEnum.MED,
  Longo: FormCOPSOQLevelEnum.LONG,
};

type inputData = Item[];
type createData = {
  risk: FormQuestionRiskEntity;
  options: FormQuestionOptionEntity[];
  copsoq: FormQuestionCOPSOQEntity;
  question: FormQuestionDetailsEntity;
  questionShared: FormQuestionEntity | null;
}[];
type createFormData = {
  form: FormEntity;
  groups: Record<
    FormCOPSOQCategoryEnum,
    {
      items: { data: createData[0] }[];
      group: FormQuestionGroupEntity;
    }
  >;
};

// Function to read, modify, and save the JSON data
async function processJsonFile(inputFilePath: string, outputFilePath: string): Promise<void> {
  const copsoqQuestions: createData = [];
  const form = {
    groups: {},
    form: new FormEntity({
      companyId: simpleCompanyId,
      name: 'Formularios de Riscos Psicosociais',
      anonymous: true,
      shareableLink: true,
      description: 'Descrição do formulário',
      system: true,
      type: FormTypeEnum.PSYCHOSOCIAL,
    }),
  } as createFormData;

  try {
    const rawData = await fs.readFile(inputFilePath, 'utf-8');
    const jsonData: inputData = JSON.parse(rawData);

    await asyncBatch(jsonData, 1, async (record) => {
      function getValue(text: string) {
        const v = Number(String(text).substring(0, 1));

        const isDirect = record.Proprocionalidade === 'Direta' ? true : false;
        return isDirect ? v : 6 - v;
      }

      function cleanText(text: string) {
        return String(text).trim().replace('1 (', '').replace('2 (', '').replace('3 (', '').replace('4 (', '').replace('5 (', '').replace(')', '').replaceAll(' ', ' ');
      }

      const dimension = dimensionMapper[record.Dimensão];
      const category = categoryMapper[record.Categoria];
      const level = levelMapper[record.Nível];

      if (!dimension) {
        console.error('Dimension not found in mapper:', record.Dimensão);
        console.error('Available dimensions:', Object.keys(dimensionMapper));
        throw new Error(`Dimension not found: ${record.Dimensão}`);
      }

      if (!category) {
        console.error('Category not found in mapper:', record.Categoria);
        console.error('Available categories:', Object.keys(categoryMapper));
        throw new Error(`Category not found: ${record.Categoria}`);
      }

      if (!level) {
        console.error('Level not found in mapper:', record.Nível);
        console.error('Available levels:', Object.keys(levelMapper));
        throw new Error(`Level not found: ${record.Nível}`);
      }

      const copsoqQuestion = new FormQuestionCOPSOQEntity({
        dimension,
        category,
        item: record['Nome do Item'],
        question: record['Pergunta Traduzida'],
        level,
      });

      const questionType = record.TIPO === 'Outros' ? FormQuestionTypeEnum.CHECKBOX : FormQuestionTypeEnum.RADIO;
      const question = new FormQuestionDetailsEntity({
        type: questionType,
        companyId: simpleCompanyId,
        text: (record['Pergunta Aplicada'] || record['Pergunta Traduzida']).replaceAll(' ', ' '),
        acceptOther: false,
        system: true,
      });

      let riskFactor = await prisma.riskFactors.findFirst({
        where: {
          name: record['Fator de Risco'],
        },
      });

      if (!riskFactor) {
        console.log('Fator de risco não encontrado: ' + record['Fator de Risco']);

        const subType = await prisma.riskSubType.findFirst({
          where: {
            sub_type: RiskSubTypeEnum.PSICOSOCIAL,
          },
        });

        console.log('subType', subType?.id);

        riskFactor = await prisma.riskFactors.create({
          data: {
            name: record['Fator de Risco'],
            severity: Number(record['Severidade']) || 4,
            type: 'ERG',
            companyId: simpleCompanyId,
          },
        });

        await prisma.riskToRiskSubType.create({
          data: {
            risk_id: riskFactor.id,
            sub_type_id: subType?.id || 0,
          },
        });

        console.log('Fator de risco criado: ' + riskFactor.id);
        // throw new Error('Fator de risco não encontrado: ' + record['Fator de Risco']);
      }

      const risk = new FormQuestionRiskEntity({
        questionId: question.id,
        riskId: riskFactor.id,
      });

      console.log('record', record);

      const options = [
        new FormQuestionOptionEntity({
          text: cleanText(record['Opções 1']),
          order: 1,
          value: getValue(record['Opções 1']),
        }),
        new FormQuestionOptionEntity({
          text: cleanText(record['Opções 2']),
          order: 2,
          value: getValue(record['Opções 2']),
        }),
        new FormQuestionOptionEntity({
          text: cleanText(record['Opções 3']),
          order: 3,
          value: getValue(record['Opções 3']),
        }),
        new FormQuestionOptionEntity({
          text: cleanText(record['Opções 4']),
          order: 4,
          value: getValue(record['Opções 4']),
        }),
        new FormQuestionOptionEntity({
          text: cleanText(record['Opções 5']),
          order: 5,
          value: getValue(record['Opções 5']),
        }),
      ];

      const questionShared = record.Nº
        ? new FormQuestionEntity({
            order: Number(record.Nº),
            required: true,
            groupId: '', // Will be set later
          })
        : null;

      const data: createData[0] = { copsoq: copsoqQuestion, question, options, risk, questionShared };

      copsoqQuestions.push(data);

      const canAddGroup = !!record.Nº;
      const needToCreateGroup = canAddGroup && !form.groups[copsoqQuestion.category];

      if (needToCreateGroup) {
        form.groups[copsoqQuestion.category] = {
          group: new FormQuestionGroupEntity({
            name: record.Categoria,
            order: Number(record.Nº),
          }),
          items: [],
        };
      }

      if (canAddGroup) {
        form.groups[copsoqQuestion.category].group.order = Math.min(form.groups[copsoqQuestion.category].group.order, Number(record.Nº));
        form.groups[copsoqQuestion.category].items.push({ data });
      }
    });

    const updatedJsonString = JSON.stringify(form, null, 2); // null, 2 for pretty printing (optional)

    await createRows(copsoqQuestions, form);
    console.log('Rows created successfully');
    await createForm(copsoqQuestions, form);
    console.log('Form created successfully');
    await createIdentifiers();
    console.log('Form identifier successfully');
    await fs.writeFile(outputFilePath, updatedJsonString, 'utf-8');

    console.log(`JSON data successfully processed and saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error processing JSON file:', error);
    if (error instanceof Error) {
      console.error(error.message); // More specific error message
    }
  }
}

async function createRows(data: createData, _form: createFormData): Promise<void> {
  await asyncBatch(data, 20, async (item) => {
    // First, create or find the FormQuestionDetails
    let questionDetails = await prisma.formQuestionDetails.findFirst({
      where: {
        company_id: item.question.companyId,
        system: item.question.system,
        form_question_risk: {
          some: {
            risk_id: item.risk.riskId,
          },
        },
        data: {
          some: {
            text: item.question.text,
          },
        },
      },
    });

    if (!questionDetails) {
      questionDetails = await prisma.formQuestionDetails.create({
        data: {
          company_id: item.question.companyId,
          system: item.question.system,
          form_question_risk: {
            create: {
              risk_id: item.risk.riskId,
            },
          },
          options: {
            create: item.options.map((option) => ({
              data: {
                create: {
                  text: option.text,
                  order: option.order,
                  value: option.value,
                },
              },
            })),
          },
        },
      });
    }

    // Create or update the COPSOQ question
    const questionCOPSOQ = await prisma.formQuestionCOPSOQ.upsert({
      where: {
        item: item.copsoq.item,
      },
      update: {
        category: item.copsoq.category,
        dimension: item.copsoq.dimension,
        level: item.copsoq.level,
        question: item.copsoq.question,
      },
      create: {
        category: item.copsoq.category,
        dimension: item.copsoq.dimension,
        item: item.copsoq.item,
        level: item.copsoq.level,
        question: item.copsoq.question,
      },
    });

    // Create or find the FormQuestionDetailsData linking COPSOQ to FormQuestionDetails
    let questionDetailsData = await prisma.formQuestionDetailsData.findFirst({
      where: {
        question_copsoq_id: questionCOPSOQ.id,
        form_question_details_id: questionDetails.id,
      },
    });

    if (!questionDetailsData) {
      questionDetailsData = await prisma.formQuestionDetailsData.create({
        data: {
          text: item.question.text,
          type: item.question.type,
          accept_other: item.question.acceptOther,
          question_copsoq_id: questionCOPSOQ.id,
          form_question_details_id: questionDetails.id,
        },
      });
    } else {
      questionDetailsData = await prisma.formQuestionDetailsData.update({
        where: {
          id: questionDetailsData.id,
        },
        data: {
          text: item.question.text,
          type: item.question.type,
          accept_other: item.question.acceptOther,
        },
      });
    }

    // Store question data for later creation after groups are created
    if (item.questionShared) {
      // We'll create the FormQuestion later in createForm after groups are created
      // For now, just ensure the question details are created
    }
  });
}

async function createForm(_data: createData, form: createFormData): Promise<void> {
  let dbForm = await prisma.form.findFirst({
    where: {
      name: form.form.name,
    },
  });

  dbForm = await prisma.form.upsert({
    where: {
      id: dbForm?.id || '',
    },
    update: {},
    create: {
      name: form.form.name,
      description: form.form.description,
      system: form.form.system,
      type: form.form.type,
      shareable_link: form.form.shareableLink,
      anonymous: form.form.anonymous,
      company_id: form.form.companyId,
    },
  });

  if (!dbForm) return;

  await asyncBatch(Object.values(form.groups), 20, async (group) => {
    let dbGroup = await prisma.formQuestionGroup.findFirst({
      where: {
        data: {
          some: {
            name: group.group.name,
          },
        },
      },
    });

    dbGroup = await prisma.formQuestionGroup.upsert({
      where: {
        id: dbGroup?.id || '',
      },
      update: {},
      create: {
        form_id: dbForm.id,
        data: {
          create: {
            name: group.group.name,
            order: group.group.order,
            description: group.group.description,
          },
        },
      },
    });

    if (!dbGroup) return;

    await asyncBatch(group.items, 20, async (item) => {
      const formQuestionCOPSOQ = await prisma.formQuestionCOPSOQ.findFirst({
        where: {
          item: item.data.copsoq.item,
        },
        select: {
          form_question_data: {
            select: {
              form_question_details: {
                select: {
                  id: true,
                  form_question: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const questionDetails = formQuestionCOPSOQ?.form_question_data[0]?.form_question_details;
      if (questionDetails) {
        // Check if FormQuestion already exists
        const existingFormQuestion = questionDetails.form_question[0];

        if (existingFormQuestion) {
          // Update existing FormQuestion with the correct group
          await prisma.formQuestion.update({
            where: {
              id: existingFormQuestion.id,
            },
            data: {
              question_group_id: dbGroup.id,
            },
          });
        } else if (item.data.questionShared) {
          // Create new FormQuestion if it doesn't exist and questionShared is provided
          await prisma.formQuestion.create({
            data: {
              question_details_id: questionDetails.id,
              question_group_id: dbGroup.id,
              data: {
                create: {
                  order: item.data.questionShared.order,
                  required: item.data.questionShared.required,
                },
              },
            },
          });
        }
      } else {
        console.log('Question details not found for item:', item.data.copsoq.item);
      }
    });
  });
}

async function createIdentifiers(): Promise<void> {
  const idCreate = [
    { enum: FormIdentifierTypeEnum.EMAIL, direct: true, text: 'Email', type: FormQuestionTypeEnum.TEXT },
    { enum: FormIdentifierTypeEnum.CPF, direct: true, text: 'CPF', type: FormQuestionTypeEnum.TEXT },
    { enum: FormIdentifierTypeEnum.AGE, direct: true, text: 'Idade', type: FormQuestionTypeEnum.DATE },
    { enum: FormIdentifierTypeEnum.SEX, direct: false, text: 'Sexo', type: FormQuestionTypeEnum.RADIO },
    { enum: FormIdentifierTypeEnum.WORKSPACE, direct: false, text: 'Estabelecimento', type: FormQuestionTypeEnum.SELECT },
    { enum: FormIdentifierTypeEnum.DIRECTORY, direct: false, text: 'Diretória', type: FormQuestionTypeEnum.SELECT },
    { enum: FormIdentifierTypeEnum.MANAGEMENT, direct: false, text: 'Gerência', type: FormQuestionTypeEnum.SELECT },
    { enum: FormIdentifierTypeEnum.SECTOR, direct: false, text: 'Setor', type: FormQuestionTypeEnum.SELECT },
  ];

  asyncBatch(idCreate, 20, async (item) => {
    const identifier = await prisma.formQuestionIdentifier.findFirst({
      where: {
        type: item.enum,
      },
    });

    if (!identifier) {
      await prisma.formQuestionIdentifier.create({
        data: {
          type: item.enum,
          direct_association: item.direct,
          system: true,
          form_question_data: {
            create: {
              text: item.text,
              type: item.type,
              accept_other: false,
              form_question_details: {
                create: {
                  company_id: simpleCompanyId,
                  system: true,
                },
              },
            },
          },
        },
      });
    }
  });
}

export async function mainFormatCreate() {
  console.log('Processing JSON data...');
  const inputFilePath = path.join(__dirname, 'input.json'); // Replace with your input file path
  console.log('Input file path:', inputFilePath);
  const outputFilePath = path.join(__dirname, 'output.json'); // Replace with your desired output file path
  console.log('Output file path:', outputFilePath);

  await processJsonFile(inputFilePath, outputFilePath);
}

mainFormatCreate();
