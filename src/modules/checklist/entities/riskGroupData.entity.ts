import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

import { RiskFactorGroupData } from '.prisma/client';
import { CompanyEntity } from '../../../modules/company/entities/company.entity';
import { RiskFactorDataEntity } from './riskData.entity';
import { ProfessionalEntity } from '../../../modules/users/entities/professional.entity';
import { UserEntity } from '../../../modules/users/entities/user.entity';
import { dayjs } from '../../../shared/providers/DateProvider/implementations/DayJSProvider';

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
  isQ5: boolean;
  validityEnd: Date;
  validityStart: Date;
  professionals?: ProfessionalEntity[];
  users?: UserEntity[];

  constructor(partial: Partial<RiskFactorGroupDataEntity>) {
    Object.assign(this, partial);

    if (partial?.data) {
      this.data = partial.data.map((d) => new RiskFactorDataEntity(d));
    }

    if (this.validityStart && this.validityEnd) {
      this.validity =
        dayjs(this.validityStart).format('MM/YYYY') +
        ' a ' +
        dayjs(this.validityEnd).format('MM/YYYY');
    }
  }
}
