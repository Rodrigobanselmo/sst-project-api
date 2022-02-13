import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateRiskDto } from '../../dto/create-risk.dto';
import { RiskFactorsEntity } from '../../entities/risk.entity';
import { IRiskRepository } from '../IRiskRepository.types';

@Injectable()
export class RiskRepository implements IRiskRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createRiskDto: CreateRiskDto,
    system: boolean,
  ): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.create({
      data: {
        ...createRiskDto,
        system,
      },
    });

    return new RiskFactorsEntity(risk);
  }
}
