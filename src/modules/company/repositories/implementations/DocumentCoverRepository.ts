import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { DocumentCoverEntity } from '../../entities/document-cover.entity';
import { CreateDocumentCoverDto, UpdateDocumentCoverDto } from '../../dto/document-cover.dto';

@Injectable()
export class DocumentCoverRepository {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: CreateDocumentCoverDto): Promise<DocumentCoverEntity> {
    const documentCover = await this.prisma.documentCover.create({
      data: {
        companyId,
        name: data.name,
        acceptType: data.acceptType || [],
        json: data.json as unknown as Prisma.InputJsonValue,
      },
    });

    return new DocumentCoverEntity(documentCover);
  }

  async update(companyId: string, data: UpdateDocumentCoverDto): Promise<DocumentCoverEntity> {
    const documentCover = await this.prisma.documentCover.update({
      where: { id_companyId: { id: data.id, companyId } },
      data: {
        name: data.name,
        acceptType: data.acceptType,
        json: data.json as unknown as Prisma.InputJsonValue,
      },
    });

    return new DocumentCoverEntity(documentCover);
  }

  async delete(companyId: string, id: number): Promise<void> {
    await this.prisma.documentCover.delete({
      where: { id_companyId: { id, companyId } },
    });
  }

  async findById(companyId: string, id: number): Promise<DocumentCoverEntity | null> {
    const documentCover = await this.prisma.documentCover.findUnique({
      where: { id_companyId: { id, companyId } },
    });

    return documentCover ? new DocumentCoverEntity(documentCover) : null;
  }

  async findByCompany(companyId: string): Promise<DocumentCoverEntity[]> {
    const documentCovers = await this.prisma.documentCover.findMany({
      where: { companyId },
    });

    return documentCovers.map((cover) => new DocumentCoverEntity(cover));
  }

  async upsert(companyId: string, data: CreateDocumentCoverDto & { id?: number }): Promise<DocumentCoverEntity> {
    const documentCover = await this.prisma.documentCover.upsert({
      where: { id_companyId: { id: data.id || 0, companyId } },
      create: {
        companyId,
        name: data.name,
        acceptType: data.acceptType || [],
        json: data.json as unknown as Prisma.InputJsonValue,
      },
      update: {
        name: data.name,
        acceptType: data.acceptType,
        json: data.json as unknown as Prisma.InputJsonValue,
      },
    });

    return new DocumentCoverEntity(documentCover);
  }
}

