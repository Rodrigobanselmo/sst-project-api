import { PrismaService } from './../../../../prisma/prisma.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllTable27Service } from '../../services/tables/find-all-27.service';
import { FindCitiesDto } from '../../dto/cities.dto';
import { Prisma } from '@prisma/client';
import { FindEsocialTable24Dto } from '../../dto/event.dto';

@ApiTags('tables')
@Controller('esocial')
export class TablesController {
  constructor(private readonly findAllTable27Service: FindAllTable27Service, private readonly prisma: PrismaService) {}

  @Get('cities')
  async findC(@Query() query: FindCitiesDto) {
    const { skip, take, search } = query;

    const where: Prisma.CitiesFindManyArgs['where'] = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const response = await this.prisma.$transaction([
      this.prisma.cities.count({
        where,
      }),
      this.prisma.cities.findMany({
        where,
        skip: skip || 0,
        take: take || 20,
        orderBy: { name: 'asc' },
        select: { code: true, name: true, uf: { select: { uf: true } } },
      }),
    ]);

    return {
      data: response[1],
      count: response[0],
    };
  }

  @Get('cid')
  async findCid(@Query() query: FindCitiesDto) {
    const { skip, take, search } = query;
    const data = await this.prisma.cid.findMany({
      where: {
        ...(search && { OR: [{ cid: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }),
      },
      skip: skip || 0,
      take: take || 20,
      select: { cid: true, description: true },
      orderBy: { cid: 'asc' },
    });

    return { data };
  }

  @Get('absenteeism-motives')
  async findM() {
    const data = await this.prisma.absenteeismMotive.findMany({ select: { id: true, desc: true }, orderBy: { desc: 'asc' } });
    return { data };
  }

  @Get('table-6')
  async find6(@Query() query: FindCitiesDto) {
    const { skip, take, search } = query;
    const data = await this.prisma.esocialTable6Country.findMany({
      where: {
        ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }] }),
      },
      skip: skip || 0,
      take: take || 20,
      select: { code: true, name: true },
      orderBy: { name: 'asc' },
    });

    return { data };
  }

  @Get('table-13')
  async find13() {
    const data = await this.prisma.esocialTable13BodyPart.findMany({ select: { code: true, desc: true }, orderBy: { desc: 'asc' } });
    return { data };
  }

  @Get('table-14-15')
  async find1415() {
    const data = await this.prisma.esocialTable14And15Acid.findMany({ select: { code: true, desc: true, case: true }, orderBy: { desc: 'asc' } });
    return { data };
  }

  @Get('table-15')
  async find15() {
    const data = await this.prisma.esocialTable14And15Acid.findMany({ select: { code: true, desc: true, case: true }, where: { table: 15 }, orderBy: { desc: 'asc' } });
    return { data };
  }

  @Get('table-17')
  async find17() {
    const data = await this.prisma.esocialTable17Injury.findMany({ select: { code: true, desc: true }, orderBy: { desc: 'asc' } });
    return { data };
  }

  @Get('table-18')
  async find18() {
    const data = await this.prisma.esocialTable18Mot.findMany({ select: { code: true, description: true, id: true }, orderBy: { description: 'asc' } });
    return { data };
  }

  @Get('table-20')
  async find20(@Query() query: FindCitiesDto) {
    const { skip, take, search } = query;

    const where: Prisma.EsocialTable20LogradFindManyArgs['where'] = {
      ...(search && { OR: [{ desc: { contains: search, mode: 'insensitive' } }] }),
    };

    const response = await this.prisma.$transaction([
      this.prisma.esocialTable20Lograd.count({
        where,
      }),
      this.prisma.esocialTable20Lograd.findMany({
        where,
        skip: skip || 0,
        take: take || 20,
        select: { code: true, desc: true },
        orderBy: { desc: 'asc' },
      }),
    ]);

    return {
      data: response[1],
      count: response[0],
    };
  }
  // async find20(@Query() query: FindCitiesDto) {
  //   const { skip, take, search } = query;
  //   const data = await this.prisma.esocialTable20Lograd.findMany({
  //     where: {
  //       ...(search && { OR: [{ desc: { contains: search, mode: 'insensitive' } }] }),
  //     },
  //     skip: skip || 0,
  //     take: take || 20,
  //     select: { code: true, desc: true },
  //     orderBy: { desc: 'asc' },
  //   });

  //   return { data };
  // }

  //not been used
  @Get('table-24')
  async find24(@Query() query: FindEsocialTable24Dto) {
    const data = await this.prisma.esocialTable24.findMany({
      ...(query.type && { where: { type: query.type } }),
      select: { id: true, name: true, type: true },
      orderBy: { name: 'asc' },
    });
    return { data };
  }

  //not been used
  @Get('table-27')
  find27() {
    return this.findAllTable27Service.execute();
  }
}
