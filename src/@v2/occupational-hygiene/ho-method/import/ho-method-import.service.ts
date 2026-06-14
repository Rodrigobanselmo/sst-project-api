import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { HoMethodDAO } from '../ho-method.dao';
import { HoMethodRiskSearchService } from '../ho-method-risk-search.service';
import { extractPdfText } from './ho-method-pdf-text.util';
import { parseNioshNmamPdfText } from './ho-method-niosh-parser';
import { HoMethodImportParseResult } from './ho-method-import.types';

@Injectable()
export class HoMethodImportService {
  constructor(
    private readonly hoMethodDAO: HoMethodDAO,
    private readonly hoMethodRiskSearchService: HoMethodRiskSearchService,
  ) {}

  async parsePdf(params: {
    buffer: Buffer;
    filename?: string;
    companyId: string;
  }): Promise<HoMethodImportParseResult> {
    if (!params.buffer?.length) {
      throw new BadRequestException('Envie um arquivo PDF.');
    }

    if (!params.filename?.toLowerCase().endsWith('.pdf')) {
      throw new BadRequestException('Envie um arquivo PDF (.pdf).');
    }

    const text = await extractPdfText(params.buffer);
    if (!text.trim()) {
      throw new BadRequestException(
        'Não foi possível extrair texto do PDF. OCR não está disponível nesta fase.',
      );
    }

    const parsed = parseNioshNmamPdfText(text);
    const agents = await this.matchAgents(params.companyId, parsed.agents);

    const institution = parsed.fields.institution.value ?? 'NIOSH';
    const methodCode = parsed.fields.methodCode.value;
    const methodVersion = parsed.fields.methodVersion.value;

    let possibleDuplicate = parsed.possibleDuplicate;
    if (methodCode) {
      const exists = await this.hoMethodDAO.existsDuplicate({
        institution,
        methodCode,
        methodVersion,
      });

      if (exists) {
        possibleDuplicate = {
          exists: true,
          message: 'Método possivelmente já cadastrado.',
          existingMethodId: null,
        };
        parsed.warnings.push(possibleDuplicate.message);
      }
    }

    const unmatchedAgents = agents.filter((agent) => !agent.found);
    const canConfirm =
      parsed.isSupportedMethod &&
      Boolean(methodCode) &&
      agents.length > 0 &&
      unmatchedAgents.length === 0;

    const confirmBlockReason = !parsed.isSupportedMethod
      ? 'O PDF não parece ser um método NIOSH/NMAM suportado.'
      : !methodCode
        ? 'Informe ou confirme o código do método antes de importar.'
        : agents.length === 0
          ? 'Nenhum agente identificado para importação.'
          : unmatchedAgents.length > 0
            ? 'Vincule todos os agentes a fatores de risco químicos cadastrados antes de confirmar.'
            : null;

    return {
      ...parsed,
      agents,
      possibleDuplicate,
      canConfirm,
      confirmBlockReason,
    };
  }

  private async matchAgents(
    companyId: string,
    agents: HoMethodImportParseResult['agents'],
  ) {
    return Promise.all(
      agents.map(async (agent) => {
        const searchTerm = agent.cas || agent.substanceName;
        const matches = await this.hoMethodRiskSearchService.search({
          companyId,
          search: searchTerm,
          limit: 5,
        });

        const matched =
          matches.find((item) =>
            agent.cas
              ? item.cas?.replace(/[-\s]/g, '') ===
                agent.cas.replace(/[-\s]/g, '')
              : item.name.toLowerCase() === agent.substanceName.toLowerCase(),
          ) ?? matches[0];

        return {
          ...agent,
          matchedRiskFactor: matched ?? null,
          found: Boolean(matched),
        };
      }),
    );
  }
}
