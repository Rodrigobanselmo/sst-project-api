import { StatusBrowseModel } from '@/@v2/security/status/domain/models/status/status-browse.model';
import { IStatusBrowseResultModelMapper, StatusBrowseResultModelMapper } from './status-browse-result.mapper';

export type IStatusBrowseModelMapper = {
  results: IStatusBrowseResultModelMapper[]
}

export class StatusBrowseModelMapper {
  static toModel(prisma: IStatusBrowseModelMapper): StatusBrowseModel {
    return new StatusBrowseModel({
      results: StatusBrowseResultModelMapper.toModels(prisma.results),
    })
  }
}
