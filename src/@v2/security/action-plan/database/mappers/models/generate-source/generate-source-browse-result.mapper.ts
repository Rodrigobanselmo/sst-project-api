import { GenerateSourceBrowseResultModel } from '@/@v2/security/action-plan/domain/models/generate-source/generate-source-browse-result.model';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export type IGenerateSourceBrowseResultModelMapper = {
  generate_source_id: string;
  generate_source_name: string;
  generate_source_created_at: Date;
  generate_source_updated_at: Date;
  risk_id: string;
  risk_name: string;
  risk_type: string;
};

export class GenerateSourceBrowseResultModelMapper {
  static toModel(prisma: IGenerateSourceBrowseResultModelMapper): GenerateSourceBrowseResultModel {
    return new GenerateSourceBrowseResultModel({
      id: prisma.generate_source_id,
      name: prisma.generate_source_name,
      createdAt: prisma.generate_source_created_at,
      updatedAt: prisma.generate_source_updated_at,
      risk: {
        id: prisma.risk_id,
        name: prisma.risk_name,
        type: RiskTypeEnum[prisma.risk_type],
      },
    });
  }

  static toModels(prisma: IGenerateSourceBrowseResultModelMapper[]): GenerateSourceBrowseResultModel[] {
    return prisma.map((generateSource) => this.toModel(generateSource));
  }
}
