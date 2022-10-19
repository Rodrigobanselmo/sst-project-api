import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

import { dayjs } from '../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyEntity } from '../../company/entities/company.entity';
import { ProfessionalEntity } from '../../users/entities/professional.entity';
import { RiskFactorDataEntity } from './riskData.entity';
import { ProfessionalPCMSOEntity } from './usersRiskGroup';
import { DocumentPCMSO } from '.prisma/client';

export class DocumentPCMSOEntity implements DocumentPCMSO {
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
  workspaceId?: string;
  elaboratedBy: string | null;
  approvedBy: string | null;
  revisionBy: string | null;
  documentDate: Date | null;
  visitDate: Date | null;
  validity: string;
  coordinatorBy: string;
  validityEnd: Date;
  validityStart: Date;

  company?: Partial<CompanyEntity>;
  professionals?: ProfessionalEntity[];
  professionalsSignatures?: ProfessionalPCMSOEntity[];

  // users?: UserEntity[];
  // usersSignatures?: UsersRiskGroupEntity[];
  // company?: CompanyEntity;

  constructor(partial: Partial<DocumentPCMSOEntity>) {
    Object.assign(this, partial);

    if (partial?.data) {
      this.data = partial.data.map((d) => new RiskFactorDataEntity(d));
    }

    // if (!this.users) this.users = [];
    // if (partial?.usersSignatures) {
    //   this.usersSignatures = partial.usersSignatures.map(
    //     (epiToRiskFactorData) => new UsersRiskGroupEntity(epiToRiskFactorData),
    //   );

    //   this.users = this.usersSignatures.map(
    //     ({ user, ...epiToRiskFactorData }) =>
    //       new UserEntity({
    //         ...user,
    //         userPgrSignature: epiToRiskFactorData,
    //       }),
    //   );
    // }

    if (!this?.professionals) this.professionals = [];
    if (partial?.professionalsSignatures) {
      this.professionalsSignatures = partial.professionalsSignatures.map(
        (professionalSig) => new ProfessionalPCMSOEntity(professionalSig),
      );

      this.professionals = this.professionalsSignatures.map(
        ({ professional, ...rest }) =>
          new ProfessionalEntity({
            ...professional,
            professionalPcmsoSignature: rest,
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
