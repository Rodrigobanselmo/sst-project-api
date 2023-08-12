import { normalizeString } from './../../../../shared/utils/normalizeString';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { CreateImageGalleryDto, FindImageGalleryDto, UpdateImageGalleryDto } from '../../dto/imageGallery.dto';
import { ImageGalleryEntity } from '../../entities/image-gallery.entity';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';

@Injectable()
export class ImageGalleryRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateImageGalleryDto & { url: string; search?: string }) {
    if (data.name) data.search = normalizeString(data.name);

    const result = await this.prisma.imageGallery.create({
      data: {
        ...data,
      },
    });

    return new ImageGalleryEntity(result);
  }

  async update({ id, companyId, ...createCompanyDto }: UpdateImageGalleryDto & { url: string; search?: string }) {
    if (createCompanyDto.name) createCompanyDto.search = normalizeString(createCompanyDto.name).toLocaleLowerCase();

    const result = await this.prisma.imageGallery.update({
      data: createCompanyDto,
      where: { companyId_id: { companyId, id } },
    });

    return new ImageGalleryEntity(result);
  }

  async findAllByCompany(query: Partial<FindImageGalleryDto>, pagination: PaginationQueryDto, options: Prisma.ImageGalleryFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ search: { contains: normalizeString(query.search).toLocaleLowerCase(), mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.imageGallery.count({
        where,
      }),
      this.prisma.imageGallery.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((data) => new ImageGalleryEntity(data)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.ImageGalleryFindManyArgs = {}) {
    const data = await this.prisma.imageGallery.findMany({
      ...options,
    });

    return data.map((image) => new ImageGalleryEntity(image));
  }

  async findFirstNude(options: Prisma.ImageGalleryFindFirstArgs = {}) {
    const data = await this.prisma.imageGallery.findFirst({
      ...options,
    });

    return new ImageGalleryEntity(data);
  }

  async delete(id: number, companyId: string) {
    const data = await this.prisma.imageGallery.delete({
      where: { companyId_id: { companyId, id } },
    });

    return new ImageGalleryEntity(data);
  }
}
