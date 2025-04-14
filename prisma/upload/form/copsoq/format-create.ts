import { FormIdentifierTypeEnum } from './../../../../src/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormEntity } from './../../../../src/@v2/forms/domain/entities/form.entity';
import { FormQuestionGroupEntity } from './../../../../src/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionEntity } from './../../../../src/@v2/forms/domain/entities/form-question.entity';
import { FormQuestionRiskEntity } from '../../../../src/@v2/forms/domain/entities/form-question-risk.entity';
import { FormQuestionOptionEntity } from '../../../../src/@v2/forms/domain/entities/form-question-option.entity';
import { simpleCompanyId } from '../../../../src/shared/constants/ids';
import { FormQuestionDataEntity } from '../../../../src/@v2/forms/domain/entities/form-question-data.entity';
import { FormQuestionCOPSOQEntity } from '../../../../src/@v2/forms/domain/entities/form-question-copsoq.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FormCOPSOQCategoryEnum } from '../../../../src/@v2/forms/domain/enums/form-copsoq-category.enum';
import { FormCOPSOQDimensionEnum } from '../../../../src/@v2/forms/domain/enums/form-copsoq-dimension.enum';
import { FormCOPSOQLevelEnum } from '../../../../src/@v2/forms/domain/enums/form-copsoq-level.enum';
import { FormQuestionTypeEnum } from '../../../../src/@v2/forms/domain/enums/form-question-type.enum';
import { PrismaClient, $Enums } from '@prisma/client';
import { asyncBatch } from '../../../../src/shared/utils/asyncBatch';
import { FormTypeEnum } from '../../../../src/@v2/forms/domain/enums/form-type.enum';

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
  question: FormQuestionDataEntity;
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

    await asyncBatch(jsonData, 20, async (record) => {
      function getValue(text: string) {
        const v = Number(text.substring(0, 1));

        const isDirect = record.Proprocionalidade === 'Direta' ? true : false;
        return isDirect ? v : 6 - v;
      }

      function cleanText(text: string) {
        return text.trim().replace('1 (', '').replace('2 (', '').replace('3 (', '').replace('4 (', '').replace('5 (', '').replace(')', '').replaceAll(' ', ' ');
      }

      const copsoqQuestion = new FormQuestionCOPSOQEntity({
        dimension: dimensionMapper[record.Dimensão],
        category: categoryMapper[record.Categoria],
        item: record['Nome do Item'],
        question: record['Pergunta Traduzida'],
        level: levelMapper[record.Nível],
      });

      const questionType = record.TIPO === 'Outros' ? FormQuestionTypeEnum.CHECKBOX : FormQuestionTypeEnum.RADIO;
      const question = new FormQuestionDataEntity({
        type: questionType,
        companyId: simpleCompanyId,
        text: (record['Pergunta Aplicada'] || record['Pergunta Traduzida']).replaceAll(' ', ' '),
        acceptOther: false,
        system: true,
      });

      const riskFactor = await prisma.riskFactors.findFirst({
        where: {
          name: record['Fator de Risco'],
        },
      });

      if (!riskFactor) throw new Error('Fator de risco não encontrado: ' + record['Fator de Risco']);

      const risk = new FormQuestionRiskEntity({
        questionId: question.id,
        riskId: riskFactor.id,
      });

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
          })
        : null;

      const data: createData[0] = { copsoq: copsoqQuestion, question, options, risk, questionShared };

      copsoqQuestions.push(data);

      const canAddGroup = !!record.Nº;
      const needToCreateGroup = canAddGroup && !form.groups[copsoqQuestion.category];

      if (needToCreateGroup) {
        form.groups[copsoqQuestion.category] = {
          group: new FormQuestionGroupEntity({
            formId: 0,
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

async function createRows(data: createData, form: createFormData): Promise<void> {
  await asyncBatch(data, 20, async (item) => {
    const copsoq = await prisma.formQuestionCOPSOQ.findFirst({
      where: {
        item: item.copsoq.item,
      },
    });

    const questionCOPSOQ = await prisma.formQuestionCOPSOQ.upsert({
      where: {
        id: copsoq?.id || 0,
      },
      update: {
        form_question_data: {
          updateMany: {
            where: {},
            data: {
              text: item.question.text,
            },
          },
        },
      },
      create: {
        category: item.copsoq.category,
        dimension: item.copsoq.dimension,
        item: item.copsoq.item,
        level: item.copsoq.level,
        question: item.copsoq.question,
        form_question_data: {
          create: {
            text: item.question.text,
            type: item.question.type,
            accept_other: item.question.acceptOther,
            company_id: item.question.companyId,
            system: item.question.system,
            form_question_risk: {
              create: {
                risk_id: item.risk.riskId,
              },
            },
            options: {
              createMany: {
                data: item.options.map((option) => ({
                  text: option.text,
                  order: option.order,
                  value: option.value,
                })),
              },
            },
          },
        },
      },
      select: {
        form_question_data: {
          select: {
            id: true,
          },
        },
      },
    });

    if (item.questionShared) {
      const formQuestion = await prisma.formQuestion.findFirst({
        where: {
          question_data: {
            id: questionCOPSOQ.form_question_data[0].id || 0,
          },
        },
      });

      await prisma.formQuestion.upsert({
        where: {
          id: formQuestion?.id || 0,
        },
        update: {
          order: item.questionShared.order,
          required: item.questionShared.required,
        },
        create: {
          order: item.questionShared.order,
          required: item.questionShared.required,
          question_data_id: questionCOPSOQ.form_question_data[0].id,
        },
      });
    }
  });
}

async function createForm(data: createData, form: createFormData): Promise<void> {
  let dbForm = await prisma.form.findFirst({
    where: {
      name: form.form.name,
    },
  });

  dbForm = await prisma.form.upsert({
    where: {
      id: dbForm?.id || 0,
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
        name: group.group.name,
      },
    });

    dbGroup = await prisma.formQuestionGroup.upsert({
      where: {
        id: dbGroup?.id || 0,
      },
      update: {},
      create: {
        name: group.group.name,
        form_id: dbForm.id,
        order: group.group.order,
        description: group.group.description,
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
              form_question: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      const questionId = formQuestionCOPSOQ?.form_question_data[0]?.form_question[0]?.id;
      if (questionId) {
        await prisma.formQuestion.update({
          where: {
            id: questionId,
          },
          data: {
            question_group_id: dbGroup.id,
          },
        });
      } else {
        console.log('Question not found for item:', item.data.copsoq.item);
      }
    });
  });
}

async function createIdentifiers(): Promise<void> {
  const idCreate = [
    { enum: FormIdentifierTypeEnum.EMAIL, direct: true },
    { enum: FormIdentifierTypeEnum.CPF, direct: true },
    { enum: FormIdentifierTypeEnum.AGE, direct: true },
    { enum: FormIdentifierTypeEnum.SEX, direct: false },
    { enum: FormIdentifierTypeEnum.WORKSPACE, direct: false },
    { enum: FormIdentifierTypeEnum.DIRECTORY, direct: false },
    { enum: FormIdentifierTypeEnum.MANAGEMENT, direct: false },
    { enum: FormIdentifierTypeEnum.SECTOR, direct: false },
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
        },
      });
    }
  });
}

async function main() {
  console.log('Processing JSON data...');
  const inputFilePath = path.join(__dirname, 'input.json'); // Replace with your input file path
  console.log('Input file path:', inputFilePath);
  const outputFilePath = path.join(__dirname, 'output.json'); // Replace with your desired output file path
  console.log('Output file path:', outputFilePath);

  await processJsonFile(inputFilePath, outputFilePath);
}

main();
