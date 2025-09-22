import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { FormParticipantsBrowseResultModelMapper, IFormParticipantsBrowseResultModelMapper } from './form-participants-browse-result.mapper';
import { FormParticipantsBrowseModel } from '@/@v2/forms/domain/models/form-participants/form-participants-browse.model';

export type IFormParticipantsBrowseModelMapper = {
  results: IFormParticipantsBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class FormParticipantsBrowseModelMapper {
  static toModel(prisma: IFormParticipantsBrowseModelMapper): FormParticipantsBrowseModel {
    return new FormParticipantsBrowseModel({
      results: FormParticipantsBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
