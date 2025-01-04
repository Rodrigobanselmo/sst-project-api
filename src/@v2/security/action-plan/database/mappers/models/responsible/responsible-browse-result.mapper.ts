import { ResponsibleBrowseResultModel } from "@/@v2/security/action-plan/domain/models/responsible/responsible-browse-result.model";

export type IResponsibleBrowseResultModelMapper = {
  user_id: number;
  user_name: string | null;
  user_email: string
}

export class ResponsibleBrowseResultModelMapper {
  static toModel(prisma: IResponsibleBrowseResultModelMapper): ResponsibleBrowseResultModel {
    return new ResponsibleBrowseResultModel({
      id: prisma.user_id,
      email: prisma.user_email,
      name: prisma.user_name,
    })
  }

  static toModels(prisma: IResponsibleBrowseResultModelMapper[]): ResponsibleBrowseResultModel[] {
    return prisma.map((rec) => ResponsibleBrowseResultModelMapper.toModel(rec))
  }
}
