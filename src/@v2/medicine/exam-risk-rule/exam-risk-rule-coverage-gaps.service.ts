import { Injectable } from '@nestjs/common';

import { ExamRiskRuleCoverageGapsRepository } from './exam-risk-rule-coverage-gaps.repository';
import {
  CoverageGapsQuery,
  CoverageGapsResult,
} from './exam-risk-rule-coverage-gaps.types';
import {
  buildCoverageItem,
  buildCoverageSummary,
  filterCoverageItems,
  paginateCoverageItems,
} from './exam-risk-rule-coverage-gaps.util';

@Injectable()
export class ExamRiskRuleCoverageGapsService {
  constructor(
    private readonly repository: ExamRiskRuleCoverageGapsRepository,
  ) {}

  async getCoverageGaps(query: CoverageGapsQuery): Promise<CoverageGapsResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const onlyPcmso = query.onlyPcmso !== false;
    const includeIndirect = query.includeIndirect !== false;

    const [risks, rules] = await Promise.all([
      this.repository.loadGlobalRisks({
        type: query.type,
        search: query.search,
        onlyPcmso,
      }),
      this.repository.loadActiveRules(),
    ]);

    const biologicalLinksByRisk = await this.repository.loadBiologicalLinksByRiskIds(
      risks.map((risk) => risk.id),
    );

    const allItems = risks.map((risk) =>
      buildCoverageItem(
        risk,
        rules,
        biologicalLinksByRisk.get(risk.id) ?? [],
      ),
    );

    const summary = buildCoverageSummary(allItems);
    const filteredItems = filterCoverageItems(allItems, {
      coverageStatus: query.coverageStatus,
      includeIndirect,
    });
    const paginated = paginateCoverageItems(filteredItems, page, limit);

    return {
      summary,
      items: paginated.items,
      page: paginated.page,
      limit: paginated.limit,
      count: paginated.count,
    };
  }
}
