import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { m2mGetDeletedIds } from 'src/shared/utils/m2mFilterIds';

import { PrismaService } from '../../../../prisma/prisma.service';
import { isEnvironment } from '../../../company/repositories/implementations/CharacterizationRepository';
import { UpsertDocumentPCMSODto } from '../../dto/document-pcmso.dto';
import { DocumentPCMSOEntity } from '../../entities/documentPCMSO.entity';
import { ProfessionalPCMSOEntity } from '../../entities/usersRiskGroup';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class DocumentPCMSORepository {
  constructor(private prisma: PrismaService) {}
  async upsert({
    companyId,
    id,
    // users,
    professionals,
    ...createDto
  }: UpsertDocumentPCMSODto): Promise<DocumentPCMSOEntity> {
    const documentPCMSO = await this.prisma.documentPCMSO.upsert({
      create: {
        ...createDto,
        companyId,
      },
      update: {
        ...createDto,
        companyId,
      },
      where: { id_companyId: { companyId, id: id || 'not-found' } },
      include: {
        professionalsSignatures: !!professionals,
      },
    });

    // if (users) {
    //   if (DocumentPCMSOEntity.usersSignatures?.length) {
    //     await this.prisma.DocumentPCMSOToUser.deleteMany({
    //       where: {
    //         userId: {
    //           in: m2mGetDeletedIds(
    //             DocumentPCMSOEntity.usersSignatures,
    //             users,
    //             'userId',
    //           ),
    //         },
    //         DocumentPCMSOId: DocumentPCMSOEntity.id,
    //       },
    //     });
    //   }

    //   DocumentPCMSOEntity.usersSignatures = await this.setUsersSignatures(
    //     users.map((user) => ({
    //       ...user,
    //       DocumentPCMSOId: DocumentPCMSOEntity.id,
    //     })),
    //   );
    // }

    if (professionals) {
      if (documentPCMSO.professionalsSignatures?.length) {
        await this.prisma.documentPCMSOToProfessional.deleteMany({
          where: {
            professionalId: {
              in: m2mGetDeletedIds(
                documentPCMSO.professionalsSignatures,
                professionals,
                'professionalId',
              ),
            },
            documentPCMSOId: documentPCMSO.id,
          },
        });
      }

      documentPCMSO.professionalsSignatures =
        await this.setProfessionalsSignatures(
          professionals.map((user) => ({
            ...user,
            documentPCMSOId: documentPCMSO.id,
          })),
        );
    }

    return new DocumentPCMSOEntity(documentPCMSO);
  }

  async findAllByCompany(companyId: string) {
    const docs = await this.prisma.documentPCMSO.findMany({
      where: { companyId },
    });

    return docs.map((data) => new DocumentPCMSOEntity(data));
  }

  async findById(
    companyId: string,
    options: {
      select?: Prisma.DocumentPCMSOSelect;
      include?: Prisma.DocumentPCMSOInclude;
    } = {},
  ) {
    const doc = await this.prisma.documentPCMSO.findUnique({
      where: { companyId },
      ...options,
    });

    return new DocumentPCMSOEntity(doc);
  }

  async findAllDataById(
    id: string,
    workspaceId: string,
    companyId: string,
    options: {
      select?: Prisma.DocumentPCMSOSelect;
      include?: Prisma.DocumentPCMSOInclude;
    } = {},
  ) {
    const docPCMSO = await this.prisma.documentPCMSO.findUnique({
      where: { id_companyId: { id, companyId } },
      include: {
        company: {
          include: {
            riskFactorData: {
              where: {
                homogeneousGroup: {
                  hierarchyOnHomogeneous: {
                    some: {
                      OR: [
                        { workspaceId: workspaceId },
                        {
                          hierarchy: {
                            workspaces: {
                              some: { id: workspaceId },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              include: {
                adms: true,
                recs: true,
                generateSources: true,
                epiToRiskFactorData: { include: { epi: true } },
                engsToRiskFactorData: { include: { recMed: true } },
                riskFactor: {
                  include: {
                    docInfo: {
                      where: {
                        OR: [
                          { companyId },
                          {
                            company: {
                              applyingServiceContracts: {
                                some: { receivingServiceCompanyId: companyId },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                dataRecs: true,
                hierarchy: {
                  //! edit employee
                  include: { employees: { select: { _count: true } } },
                },
                homogeneousGroup: {
                  include: { characterization: true, environment: true },
                },
              },
            },
          },
        },
        professionalsSignatures: {
          include: { professional: { include: { professional: true } } },
        },
        // usersSignatures: {
        //   include: {
        //     user: {
        //       include: { professional: { include: { councils: true } } },
        //     },
        //   },
        // },
      },
    });

    docPCMSO.company.riskFactorData.map((data, index) => {
      if (
        data.homogeneousGroup.characterization &&
        isEnvironment(data.homogeneousGroup.characterization.type)
      ) {
        docPCMSO.company.riskFactorData[index].homogeneousGroup.environment =
          data.homogeneousGroup.characterization as any;
        docPCMSO.company.riskFactorData[
          index
        ].homogeneousGroup.characterization = data.homogeneousGroup.characterization =
          null;
      }
    });

    // const DocumentPCMSO = {
    //   ...DocumentPCMSOEntity,
    // } as any;

    // DocumentPCMSO.data = DocumentPCMSOEntity.data.map(
    //   (riskData) => {
    //     const data = { ...riskData } as any;
    //     if (
    //       data.homogeneousGroup &&
    //       data.homogeneousGroup.hierarchyOnHomogeneous
    //     )
    //       data.homogeneousGroup.hierarchies =
    //         riskData.homogeneousGroup.hierarchyOnHomogeneous.map(
    //           (hierarchy) => ({
    //             ...hierarchy.hierarchy,
    //             hierarchyId: hierarchy.hierarchyId,
    //           }),
    //         );
    //     return;
    //   },
    // );

    return new DocumentPCMSOEntity(docPCMSO);
  }

  // private async setUsersSignatures(usersSignatures: UsersRiskGroupEntity[]) {
  //   if (usersSignatures.length === 0) return [];
  //   const data = await this.prisma.$transaction(
  //     usersSignatures.map(({ user, userId, DocumentPCMSOId, ...rest }) =>
  //       this.prisma.DocumentPCMSOToUser.upsert({
  //         create: { DocumentPCMSOId, userId, ...rest },
  //         update: { DocumentPCMSOId, userId, ...rest },
  //         where: {
  //           userId_DocumentPCMSOId: { DocumentPCMSOId, userId },
  //         },
  //         include: { user: true },
  //       }),
  //     ),
  //   );

  //   return data as UsersRiskGroupEntity[];
  // }

  private async setProfessionalsSignatures(
    professionalsSignatures: ProfessionalPCMSOEntity[],
  ) {
    if (professionalsSignatures.length === 0) return [];
    const data = await this.prisma.$transaction(
      professionalsSignatures.map(
        ({ professional, professionalId, documentPCMSOId, ...rest }) =>
          this.prisma.documentPCMSOToProfessional.upsert({
            create: { documentPCMSOId, professionalId, ...rest },
            update: { documentPCMSOId, professionalId, ...rest },
            where: {
              documentPCMSOId_professionalId: {
                documentPCMSOId,
                professionalId,
              },
            },
            include: { professional: true },
          }),
      ),
    );

    return data as ProfessionalPCMSOEntity[];
  }
}
