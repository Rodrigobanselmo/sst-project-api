import { ProfessionalRiskGroupEntity } from './../../checklist/entities/usersRiskGroup';
import { Professional, ProfessionalTypeEnum, StatusEnum } from '@prisma/client';
import { UserEntity } from './user.entity';

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
  councilType: string;
  councilUF: string;
  councilId: string;
  type: ProfessionalTypeEnum;
  status: StatusEnum;
  user?: UserEntity;
  userId: number;
  crea: string;
  crm: string;
  professionalPgrSignature?: ProfessionalRiskGroupEntity;
  professionalsPgrSignatures?: ProfessionalRiskGroupEntity[];

  constructor(partial: Partial<ProfessionalEntity>) {
    Object.assign(this, partial);

    if (partial?.user) {
      this.user = new UserEntity({ ...partial.user });

      if (this.user?.name) this.name = this.user.name;
      if (this.user?.cpf) this.cpf = this.user.cpf;
      if (this.user?.phone) this.phone = this.user.phone;
      if (this.user?.email) this.email = this.user.email;

      if (!this?.crm) this.crm = this.user.crm;
      if (!this?.crea) this.crea = this.user.crea;
      if (!this?.formation) this.formation = this.user.formation;
      if (!this?.certifications) this.certifications = this.user.certifications;
    }
  }
}
