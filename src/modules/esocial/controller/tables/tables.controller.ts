import { PrismaService } from './../../../../prisma/prisma.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllTable27Service } from '../../services/tables/find-all-27.service';
import { FindCitiesDto } from '../../dto/cities.dto';

@ApiTags('tables')
@Controller('esocial')
export class TablesController {
  constructor(private readonly findAllTable27Service: FindAllTable27Service, private readonly prisma: PrismaService) {}

  @Get('cities')
  findC(@Query() query: FindCitiesDto) {
    const { skip, take, search } = query;
    return this.prisma.cities.findMany({
      where: {
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      skip: skip || 0,
      take: take || 20,
      select: { code: true, name: true, uf: { select: { uf: true } } },
    });
  }

  @Get('table-motives')
  findM() {
    return this.prisma.absenteeismMotive.findMany({ select: { id: true, desc: true } });
  }

  @Get('table-6')
  find6() {
    return this.prisma.esocialTable6Country.findMany({ select: { code: true, name: true } });
  }

  @Get('table-13')
  find13() {
    return this.prisma.esocialTable13BodyPart.findMany({ select: { code: true, desc: true } });
  }

  @Get('table-14-15')
  find1415() {
    return this.prisma.esocialTable14And15Acid.findMany({ select: { code: true, desc: true, case: true } });
  }

  @Get('table-15')
  find15() {
    return this.prisma.esocialTable14And15Acid.findMany({ select: { code: true, desc: true, case: true }, where: { table: 15 } });
  }

  @Get('table-17')
  find17() {
    return this.prisma.esocialTable17Injury.findMany({ select: { code: true, desc: true } });
  }

  @Get('table-18')
  find18() {
    return this.prisma.esocialTable18Mot.findMany({ select: { code: true, description: true, id: true } });
  }

  @Get('table-20')
  find20() {
    return this.prisma.esocialTable20Lograd.findMany({ select: { code: true, desc: true } });
  }

  @Get('table-24')
  find24() {
    return this.prisma.esocialTable24.findMany({ select: { id: true, name: true, type: true } });
  }

  @Get('table-27')
  find27() {
    return this.findAllTable27Service.execute();
  }
}
