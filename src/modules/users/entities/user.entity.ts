import { ProfessionalTypeEnum } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { ProfessionalEntity } from './professional.entity';
import { UserCompanyEntity } from './userCompany.entity';
import { User } from '.prisma/client';
import { ProfessionalCouncilEntity } from './council.entity';

export class UserEntity implements User {
  id: number;
  email: string;
  name: string;
  @Exclude()
  password: string;
  updated_at: Date;
  created_at: Date;
  deleted_at: Date | null;
  companies?: UserCompanyEntity[];

  formation: string[];
  certifications: string[];
  cpf: string;
  companyId?: string;
  phone: string;
  googleExternalId: string;
  facebookExternalId: string;
  councilType: string;
  councilUF: string;
  councilId: string;
  photoUrl: string;
  googleUser: string;
  facebookUser: string;
  token: string | null;
  type: ProfessionalTypeEnum;
  professional?: ProfessionalEntity;
  councils?: ProfessionalCouncilEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);

    if (partial?.professional) {
      this.professional = new ProfessionalEntity({ ...partial.professional });

      //!
      if (this.professional?.councilId) this.councilId = this.professional.councilId;
      if (this.professional?.councilUF) this.councilUF = this.professional.councilUF;
      if (this.professional?.councilType) this.councilType = this.professional.councilType;
      //!
      if (this.professional?.councils) this.councils = this.professional.councils;

      if (this.professional?.formation) this.formation = this.professional.formation;
      if (this.professional?.certifications) this.certifications = this.professional.certifications;
      if (!this?.type) this.type = this.professional.type;
      if (!this?.cpf) this.cpf = this.professional.cpf;
      if (!this?.phone) this.phone = this.professional.phone;
      if (!this?.name) this.name = this.professional.name;
    }
  }
}
