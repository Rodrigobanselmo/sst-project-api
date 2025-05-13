import { SubTypeBrowseResultModel } from '@/@v2/security/risk/domain/models/sub-type/sub-type-browse-result.model';

export type ISubTypeBrowseResultModelMapper = {
  id: number;
  name: string;
};

export class SubTypeBrowseResultModelMapper {
  static toModel(prisma: ISubTypeBrowseResultModelMapper): SubTypeBrowseResultModel {
    return new SubTypeBrowseResultModel({
      id: prisma.id,
      name: prisma.name,
    });
  }

  static toModels(prisma: ISubTypeBrowseResultModelMapper[]): SubTypeBrowseResultModel[] {
    return prisma.map((rec) => SubTypeBrowseResultModelMapper.toModel(rec));
  }
}
