import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { IESocialEventProvider } from '../models/IESocialEventProvider';

@Injectable()
class TecnoSpeedESocialProvider implements IESocialEventProvider {
  constructor(private readonly prisma?: PrismaService) {}

  async addCertification() {
    return;
  }
}

export { TecnoSpeedESocialProvider };
