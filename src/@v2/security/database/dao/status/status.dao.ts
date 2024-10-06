import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IStatusDAO } from './status.types';

@Injectable()
export class StatusDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async checkIfExist({ name, companyId }: IStatusDAO.CheckIfExistParams) {
    const status = await this.prisma.status.findFirst({
      where: {
        name,
        companyId,
        type: 'CHARACTERIZATION'
      }
    })

    return !!status
  }
}
