import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

import { RiskFactorGroupData } from '.prisma/client';
import { CompanyEntity } from '../../company/entities/company.entity';
import { RiskFactorDataEntity } from './riskData.entity';
import { ProfessionalEntity } from '../../users/entities/professional.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { dayjs } from '../../../shared/providers/DateProvider/implementations/DayJSProvider';
import {
  ProfessionalRiskGroupEntity,
  UsersRiskGroupEntity,
} from './usersRiskGroup';

export class RiskFactorGroupDataEntity implements RiskFactorGroupData {
  @ApiProperty({ description: 'The id of the risk group data' })
  id: string;

  @ApiProperty({ description: 'The name of the risk group data' })
  name: string;

  @ApiProperty({ description: 'The company id related to the risk group data' })
  companyId: string;

  @ApiProperty({
    description: 'The current status of the risk group data',
    examples: ['ACTIVE', 'CANCELED'],
  })
  status: StatusEnum;

  @ApiProperty({ description: 'The creation date of the risk group data' })
  created_at: Date;

  @ApiProperty({
    description: 'The array with risks data',
  })
  data?: Partial<RiskFactorDataEntity>[];

  @ApiProperty({
    description: 'The array with risks data',
  })
  company?: Partial<CompanyEntity>;

  workspaceId?: string;
  source: string | null;
  elaboratedBy: string | null;
  approvedBy: string | null;
  revisionBy: string | null;
  documentDate: Date | null;
  visitDate: Date | null;
  validity: string;
  complementarySystems: string[];
  complementaryDocs: string[];
  coordinatorBy: string;
  hasEmergencyPlan: boolean;
  isQ5: boolean;
  validityEnd: Date;
  validityStart: Date;
  professionals?: ProfessionalEntity[];
  users?: UserEntity[];
  usersSignatures?: UsersRiskGroupEntity[];
  professionalsSignatures?: ProfessionalRiskGroupEntity[];
  months_period_level_5: number;
  months_period_level_4: number;
  months_period_level_3: number;
  months_period_level_2: number;

  constructor(partial: Partial<RiskFactorGroupDataEntity>) {
    Object.assign(this, partial);

    if (partial?.data) {
      this.data = partial.data.map((d) => new RiskFactorDataEntity(d));
    }

    if (!this.users) this.users = [];
    if (partial?.usersSignatures) {
      this.usersSignatures = partial.usersSignatures.map(
        (epiToRiskFactorData) => new UsersRiskGroupEntity(epiToRiskFactorData),
      );

      this.users = this.usersSignatures.map(
        ({ user, ...epiToRiskFactorData }) =>
          new UserEntity({
            ...user,
            userPgrSignature: epiToRiskFactorData,
          }),
      );
    }

    if (!this?.professionals) this.professionals = [];
    if (partial?.professionalsSignatures) {
      this.professionalsSignatures = partial.professionalsSignatures.map(
        (epiToRiskFactorData) =>
          new ProfessionalRiskGroupEntity(epiToRiskFactorData),
      );

      this.professionals = this.professionalsSignatures.map(
        ({ professional, ...epiToRiskFactorData }) =>
          new ProfessionalEntity({
            ...professional,
            professionalPgrSignature: epiToRiskFactorData,
          }),
      );
    }

    if (this.validityStart && this.validityEnd) {
      this.validity =
        dayjs(this.validityStart).format('MM/YYYY') +
        ' a ' +
        dayjs(this.validityEnd).format('MM/YYYY');
    }
  }
}
