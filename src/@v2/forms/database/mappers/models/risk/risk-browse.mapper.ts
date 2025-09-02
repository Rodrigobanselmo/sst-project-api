import { IPagination } from '@/@v2/shared/types/pagination.types';
import { IRiskBrowseResultModelMapper } from './risk-browse-result.mapper';

export interface IRiskBrowseModelMapper {
  results: IRiskBrowseResultModelMapper[];
  pagination: IPagination & { total: number };
}

export class RiskBrowseModelMapper {
  static toModel(data: IRiskBrowseModelMapper): IRiskBrowseModelMapper {
    return {
      results: data.results.map((risk) => ({
        id: risk.id,
        name: risk.name,
        severity: risk.severity,
        type: risk.type,
      })),
      pagination: data.pagination,
    };
  }
}
