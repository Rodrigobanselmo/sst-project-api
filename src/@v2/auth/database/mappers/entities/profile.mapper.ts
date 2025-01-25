import { UserCompany } from '@prisma/client';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { AccessGroupMapper, IAccessGroupEntityMapper } from './access-group.mapper';

export type IProfileEntityMapper = UserCompany & {
  group: IAccessGroupEntityMapper | null;
};

export class ProfileMapper {
  static toEntity(data: IProfileEntityMapper): ProfileEntity {
    return new ProfileEntity({
      accessGroup: data.group ? AccessGroupMapper.toEntity(data.group) : null,
      companyId: data.companyId,
      userId: data.userId,
    });
  }
}
