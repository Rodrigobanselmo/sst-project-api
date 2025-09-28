import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { FormParticipantsBrowseResultModelMapper, IFormParticipantsBrowseResultModelMapper } from './form-participants-browse-result.mapper';
import { FormParticipantsBrowseModel } from '@/@v2/forms/domain/models/form-participants/form-participants-browse.model';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';

export type IFormParticipantsBrowseModelMapper = {
  results: IFormParticipantsBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
  cryptoAdapter: CryptoAdapter;
};

export class FormParticipantsBrowseModelMapper {
  static toModel(prisma: IFormParticipantsBrowseModelMapper): FormParticipantsBrowseModel {
    return new FormParticipantsBrowseModel({
      results: FormParticipantsBrowseResultModelMapper.toModels(prisma.results, prisma.cryptoAdapter),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
