import { ApiProperty } from '@nestjs/swagger';
import { ProfessionalTypeEnum } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { UsersRiskGroupEntity } from '../../sst/entities/usersRiskGroup';
import { ProfessionalEntity } from './professional.entity';
import { UserCompanyEntity } from './userCompany.entity';
import { User } from '.prisma/client';
import { CouncilEntity } from './council.entity';

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
  googleExternalId: string;
  facebookExternalId: string;
  councilType: string;
  councilUF: string;
  councilId: string;
  type: ProfessionalTypeEnum;
  professional?: ProfessionalEntity;
  userPgrSignature?: UsersRiskGroupEntity;
  usersPgrSignatures?: UsersRiskGroupEntity[];
  councils?: CouncilEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);

    if (partial?.professional) {
      this.professional = new ProfessionalEntity({ ...partial.professional });

      //!
      if (this.professional?.councilId)
        this.councilId = this.professional.councilId;
      if (this.professional?.councilUF)
        this.councilUF = this.professional.councilUF;
      if (this.professional?.councilType)
        this.councilType = this.professional.councilType;
      //!
      if (this.professional?.councils)
        this.councils = this.professional.councils;

      if (this.professional?.formation)
        this.formation = this.professional.formation;
      if (!this.professional?.certifications)
        this.certifications = this.professional.certifications;
      if (!this?.type) this.type = this.professional.type;
      if (!this?.cpf) this.cpf = this.professional.cpf;
      if (!this?.phone) this.phone = this.professional.phone;
      if (!this?.name) this.name = this.professional.name;
    }
  }
}
