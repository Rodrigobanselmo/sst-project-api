import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

import {
  IRiskFactorAiSuggestionsUseCase,
  RiskFactorAiSuggestionLimitsPayload,
} from '../risk-factor-ai-suggestions.types';

const internalRiskSelect = {
  id: true,
  name: true,
  cas: true,
  synonymous: true,
  risk: true,
  symptoms: true,
  severity: true,
  method: true,
  unit: true,
  nr15lt: true,
  twa: true,
  stel: true,
  acgihCeiling: true,
  ipvs: true,
  nioshRel: true,
  nioshStel: true,
  nioshCeiling: true,
  oshaPel: true,
  oshaStel: true,
  oshaCeiling: true,
  aihaWeel: true,
  aihaWeelCeiling: true,
  pv: true,
  pe: true,
  carnogenicityACGIH: true,
  carnogenicityLinach: true,
  coments: true,
} satisfies Prisma.RiskFactorsSelect;

type InternalRiskRecord = Prisma.RiskFactorsGetPayload<{
  select: typeof internalRiskSelect;
}>;

@Injectable()
export class RiskFactorAiSuggestionsPromptService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async buildPromptContext(
    params: IRiskFactorAiSuggestionsUseCase.Params,
  ): Promise<{ userPrompt: string; internalMatches: InternalRiskRecord[] }> {
    const internalMatches = await this.findInternalMatches(params);
    const userPrompt = this.buildUserPrompt(params, internalMatches);

    return { userPrompt, internalMatches };
  }

  private async findInternalMatches(
    params: IRiskFactorAiSuggestionsUseCase.Params,
  ): Promise<InternalRiskRecord[]> {
    const companyId = params.companyId;
    const cas = params.cas?.trim();
    const name = params.name?.trim();

    if (!cas && !name) return [];

    const orFilters: Prisma.RiskFactorsWhereInput[] = [];

    if (cas) {
      orFilters.push({
        cas: { equals: cas, mode: 'insensitive' },
      });
    }

    if (name) {
      orFilters.push({
        name: { equals: name, mode: 'insensitive' },
      });
      orFilters.push({
        search: { contains: name, mode: 'insensitive' },
      });
    }

    return this.prisma.riskFactors.findMany({
      where: {
        deleted_at: null,
        status: 'ACTIVE',
        representAll: false,
        OR: [{ companyId }, { system: true }],
        AND: [{ OR: orFilters }],
      },
      select: internalRiskSelect,
      take: 3,
      orderBy: { updated_at: 'desc' },
    });
  }

  private buildUserPrompt(
    params: IRiskFactorAiSuggestionsUseCase.Params,
    internalMatches: InternalRiskRecord[],
  ): string {
    const sections: string[] = [
      'Gere sugestão técnica para os campos risk, symptoms e severity com base nos dados abaixo.',
      '',
      `Tipo do fator: ${params.type}`,
      `Nome/descrição: ${params.name ?? '(não informado)'}`,
      `CAS: ${params.cas ?? '(não informado)'}`,
      `Sinônimos: ${params.synonyms ?? '(não informado)'}`,
      `Unidade: ${params.unit ?? '(não informado)'}`,
      `Método: ${params.method ?? '(não informado)'}`,
      '',
      this.formatLimitsSection(params.limits),
      'Observação: limites ocupacionais são contexto regulatório e NÃO devem, por si só, elevar a severidade sugerida.',
      this.formatKnownDataSection(params.knownData),
      this.formatSourceContextSection(params.sourceContext),
      this.formatInternalMatchesSection(internalMatches),
    ];

    return sections.filter(Boolean).join('\n');
  }

  private formatLimitsSection(limits?: RiskFactorAiSuggestionLimitsPayload): string {
    if (!limits) return 'Limites ocupacionais: (não informados)';

    const entries = Object.entries(limits).filter(([, value]) => Boolean(value?.trim()));
    if (!entries.length) return 'Limites ocupacionais: (não informados)';

    return [
      'Limites ocupacionais:',
      ...entries.map(([key, value]) => `- ${key}: ${value}`),
    ].join('\n');
  }

  private formatKnownDataSection(
    knownData?: IRiskFactorAiSuggestionsUseCase.Params['knownData'],
  ): string {
    if (!knownData) return '';

    const lines = [
      knownData.risk ? `Risco já cadastrado: ${knownData.risk}` : null,
      knownData.symptoms ? `Sintomas já cadastrados: ${knownData.symptoms}` : null,
      knownData.severity ? `Severidade já cadastrada: ${knownData.severity}` : null,
      knownData.carcinogenicityAcgih
        ? `Carcinogenicidade ACGIH: ${knownData.carcinogenicityAcgih}`
        : null,
      knownData.carcinogenicityLinach
        ? `Carcinogenicidade LINACH: ${knownData.carcinogenicityLinach}`
        : null,
      knownData.pv ? `PV (mmHg): ${knownData.pv}` : null,
      knownData.pe ? `PE (°C): ${knownData.pe}` : null,
      knownData.observations ? `Observações: ${knownData.observations}` : null,
      knownData.methodContext ? `Contexto do método: ${knownData.methodContext}` : null,
      knownData.pdfObservations
        ? `Observações do PDF: ${knownData.pdfObservations}`
        : null,
      knownData.parseWarnings?.length
        ? `Alertas do parse: ${knownData.parseWarnings.join('; ')}`
        : null,
    ].filter(Boolean);

    if (!lines.length) return '';

    return ['Dados conhecidos adicionais:', ...lines].join('\n');
  }

  private formatSourceContextSection(
    sourceContext?: IRiskFactorAiSuggestionsUseCase.Params['sourceContext'],
  ): string {
    if (!sourceContext) return '';

    return [
      'Contexto de origem:',
      `- origin: ${sourceContext.origin}`,
      sourceContext.methodInstitution
        ? `- institution: ${sourceContext.methodInstitution}`
        : null,
      sourceContext.methodCode ? `- methodCode: ${sourceContext.methodCode}` : null,
      sourceContext.methodDisplayName
        ? `- methodDisplayName: ${sourceContext.methodDisplayName}`
        : null,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private formatInternalMatchesSection(matches: InternalRiskRecord[]): string {
    if (!matches.length) return '';

    const formatted = matches.map((match, index) => {
      const synonyms = match.synonymous?.length
        ? `Sinônimos: ${match.synonymous.join('; ')}`
        : null;

      return [
        `Registro interno ${index + 1}: ${match.name}`,
        match.cas ? `CAS: ${match.cas}` : null,
        synonyms,
        match.risk ? `Risco: ${match.risk}` : null,
        match.symptoms ? `Sintomas: ${match.symptoms}` : null,
        match.severity ? `Severidade: ${match.severity}` : null,
        match.ipvs ? `IDLH/IPVS: ${match.ipvs}` : null,
        match.carnogenicityACGIH
          ? `Carcinogenicidade ACGIH: ${match.carnogenicityACGIH}`
          : null,
        match.coments ? `Observações: ${match.coments}` : null,
      ]
        .filter(Boolean)
        .join('\n');
    });

    return ['Cadastro interno do sistema (referência):', ...formatted].join('\n\n');
  }
}
