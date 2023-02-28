import { Injectable } from '@nestjs/common';
import { DocumentTypeEnum, Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { m2mGetDeletedIds } from '../../../../shared/utils/m2mFilterIds';
import { UpsertDocumentDataDto } from '../../dto/document-data.dto';
import { DocumentDataEntity } from '../../entities/documentData.entity';
import { ProfessionalDocumentDataEntity } from '../../entities/usersRiskGroup';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class DocumentDataRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({ id, companyId, json, professionals, workspaceId, type, ...createDto }: UpsertDocumentDataDto & { json?: any }): Promise<DocumentDataEntity> {
    const documentData = await this.prisma.documentData.upsert({
      create: {
        ...createDto,
        companyId,
        type,
        workspaceId,
        json: json as any,
      },
      update: {
        ...createDto,
        json: json as any,
        companyId,
        type,
        workspaceId,
      },
      where: { type_workspaceId_companyId: { type, companyId, workspaceId } },
      include: {
        professionalsSignatures: !!professionals,
      },
    });

    if (professionals) {
      if (documentData.professionalsSignatures?.length) {
        await this.prisma.documentDataToProfessional.deleteMany({
          where: {
            professionalId: {
              in: m2mGetDeletedIds(documentData.professionalsSignatures, professionals, 'professionalId'),
            },
            documentDataId: documentData.id,
          },
        });
      }

      documentData.professionalsSignatures = await this.setProfessionalsSignatures(
        professionals.map((user) => ({
          ...user,
          documentDataId: documentData.id,
        })),
      );
    }

    return new DocumentDataEntity(documentData);
  }

  async findOne(companyId: string, workspaceId: string, type: DocumentTypeEnum, options?: Partial<Prisma.DocumentDataFindUniqueArgs>) {
    const data = await this.prisma.documentData.findUnique({
      where: { type_workspaceId_companyId: { type, companyId, workspaceId } },
      include: {
        professionalsSignatures: {
          include: { professional: { include: { professional: true } } },
        },
      },
      ...options,
    });

    return new DocumentDataEntity(data);
  }

  async findFirstNude(options: Prisma.DocumentDataFindFirstArgs) {
    const data = await this.prisma.documentData.findFirst({
      ...options,
    });

    return new DocumentDataEntity(data);
  }

  async findNude(options: Prisma.DocumentDataFindManyArgs) {
    const docs = await this.prisma.documentData.findMany({
      ...options,
    });

    return docs.map((data) => new DocumentDataEntity(data));
  }

  private async setProfessionalsSignatures(professionalsSignatures: ProfessionalDocumentDataEntity[]) {
    if (professionalsSignatures.length === 0) return [];
    const data = await this.prisma.$transaction(
      professionalsSignatures.map(({ professional, professionalId, documentDataId, ...rest }) =>
        this.prisma.documentDataToProfessional.upsert({
          create: { documentDataId, professionalId, ...rest },
          update: { documentDataId, professionalId, ...rest },
          where: {
            documentDataId_professionalId: {
              documentDataId,
              professionalId,
            },
          },
          include: { professional: true },
        }),
      ),
    );

    return data as ProfessionalDocumentDataEntity[];
  }
}
