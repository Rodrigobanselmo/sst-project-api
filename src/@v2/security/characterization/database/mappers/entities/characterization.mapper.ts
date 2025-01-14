import { CharacterizationEntity } from '../../../domain/entities/characterization.entity';

export type ICharacterizationMapper = {
  id: string;
  companyId: string;
  workspaceId: string;
  stageId: number | null;
};
export class CharacterizationMapper {
  static toEntity(prisma: ICharacterizationMapper): CharacterizationEntity {
    return new CharacterizationEntity({
      id: prisma.id,
      companyId: prisma.companyId,
      workspaceId: prisma.workspaceId,
      stageId: prisma.stageId,
    });
  }
}
