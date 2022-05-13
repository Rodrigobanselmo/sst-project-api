import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
class DocxProvider {
  constructor(private readonly prisma?: PrismaService) {}

  async create() {
    return;
  }
}

export { DocxProvider };
