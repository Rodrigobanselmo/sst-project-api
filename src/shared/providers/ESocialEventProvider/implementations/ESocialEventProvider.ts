import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import {
  IESocialEventProvider,
  IIdOptions,
} from '../models/IESocialEventProvider';

@Injectable()
class ESocialEventProvider implements IESocialEventProvider {
  constructor(
    private readonly prisma?: PrismaService,
    private readonly dayJSProvider?: DayJSProvider,
  ) {}

  async addCertification() {
    return;
  }

  generateId(cpfCnpj: string, { type, seqNum }: IIdOptions) {
    const data = this.dayJSProvider.dayjs().format('YYYYMMDDHHmmss');

    const IDs = Array.from({ length: seqNum || 1 }).map(
      (num) =>
        `ID${type || 1}${cpfCnpj.padStart(14)}${data}${String(num).padStart(
          5,
        )}`,
    );

    return IDs;
  }
}

export { ESocialEventProvider };
