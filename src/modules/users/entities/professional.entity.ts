import { ProfessionalPCMSOEntity, ProfessionalRiskGroupEntity } from '../../sst/entities/usersRiskGroup';
import { Professional, ProfessionalTypeEnum, StatusEnum } from '@prisma/client';
import { UserEntity } from './user.entity';
import { InviteUsersEntity } from './invite-users.entity';
import { CouncilEntity } from './council.entity';

export class ProfessionalEntity implements Professional {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  companyId: string;
  formation: string[];
  certifications: string[];
  cpf: string;
  phone: string;
  type: ProfessionalTypeEnum;
  status: StatusEnum;
  user?: UserEntity;
  userId: number;
  invite: InviteUsersEntity;
  inviteId: string;
  councils?: CouncilEntity[];
  professionalPgrSignature?: ProfessionalRiskGroupEntity;
  professionalsPgrSignatures?: ProfessionalRiskGroupEntity[];

  professionalPcmsoSignature?: ProfessionalPCMSOEntity;
  professionalsPcmsoSignatures?: ProfessionalPCMSOEntity[];

  professionalId?: number;
  professional?: Partial<ProfessionalEntity>;
  councilType: string;
  councilUF: string;
  councilId: string;

  constructor(partial: Partial<ProfessionalEntity & { councils: any }>) {
    Object.assign(this, partial);

    if (this.professional) {
      delete this.professional.id;
      Object.assign(this, this.professional);
      delete this.professional;
    }

    if (partial?.user) {
      this.user = new UserEntity({ ...partial.user });

      if (this.user?.name) this.name = this.user.name;
      if (this.user?.cpf) this.cpf = this.user.cpf;
      if (this.user?.phone) this.phone = this.user.phone;
      if (this.user?.email) this.email = this.user.email;
    }
  }
}
