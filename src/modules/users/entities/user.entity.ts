import { UsersRiskGroupEntity } from './../../checklist/entities/usersRiskGroup';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { User } from '.prisma/client';
import { UserCompanyEntity } from './userCompany.entity';
import { ProfessionalEntity } from './professional.entity';
import { ProfessionalTypeEnum } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ description: 'The id of the User' })
  id: number;

  @ApiProperty({ description: 'The email of the User' })
  email: string;

  @ApiProperty({ description: 'The name of the User' })
  name: string;

  @ApiProperty({ description: 'The password of the User' })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'The last time that the User was updated' })
  updated_at: Date;

  @ApiProperty({ description: 'The creation date of the User account' })
  created_at: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  @ApiProperty()
  companies?: UserCompanyEntity[];

  formation: string[];
  certifications: string[];
  cpf: string;
  phone: string;
  crea: string;
  crm: string;
  googleExternalId: string;
  facebookExternalId: string;
  councilType: string;
  councilUF: string;
  councilId: string;
  type: ProfessionalTypeEnum;
  professional?: ProfessionalEntity;
  userPgrSignature?: UsersRiskGroupEntity;
  usersPgrSignatures?: UsersRiskGroupEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);

    if (partial?.professional) {
      this.professional = new ProfessionalEntity({ ...partial.professional });

      if (!this?.councilId) this.councilId = this.professional.councilId;
      if (!this?.councilUF) this.councilUF = this.professional.councilUF;
      if (!this?.councilType) this.councilType = this.professional.councilType;
      if (!this?.crm) this.crm = this.professional.crm;
      if (!this?.crea) this.crea = this.professional.crea;
      if (!this?.cpf) this.cpf = this.professional.cpf;
      if (!this?.phone) this.phone = this.professional.phone;
      if (!this?.formation) this.formation = this.professional.formation;
      if (!this?.type) this.type = this.professional.type;
      if (!this?.name) this.name = this.professional.name;
      if (!this?.certifications)
        this.certifications = this.professional.certifications;
    }
  }
}
