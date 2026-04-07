import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../company/repositories/implementations/HomoGroupRepository';
import { Injectable } from '@nestjs/common';
import { HomoTypeEnum } from '@prisma/client';

import { UpsertManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { RiskGroupDataRepository } from '../../../repositories/implementations/RiskGroupDataRepository';
import { hierarchyCreateHomo } from '../upsert-risk-data/upsert-risk.service';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';
import { PrismaService } from '../../../../../prisma/prisma.service';

@Injectable()
export class UpsertManyRiskDataService {
  constructor(
    private readonly riskDataRepository: RiskDataRepository,
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(upsertRiskDataDto: UpsertManyRiskDataDto) {
    // Extract AddOnly and Remove fields before processing
    const { recAddOnly, admsAddOnly, generateSourcesAddOnly, engsAddOnly, episCas, removeRecs, removeAdms, removeEngs, removeGenerateSources, removeEpisCas } = upsertRiskDataDto;

    // CRITICAL: Populate riskFactorGroupDataId if missing (same logic as UpsertRiskDataService)
    if (!upsertRiskDataDto.riskFactorGroupDataId) {
      const riskGroupData = await this.riskGroupDataRepository.findAllByCompany(upsertRiskDataDto.companyId);
      upsertRiskDataDto.riskFactorGroupDataId = riskGroupData[0]?.id;
    }

    (await Promise.all(
      upsertRiskDataDto.homogeneousGroupIds.map(async (homogeneousGroupId, index) => {
        const workspaceId = upsertRiskDataDto.workspaceIds ? upsertRiskDataDto.workspaceIds[index] : upsertRiskDataDto.workspaceId;

        const type = upsertRiskDataDto.type;

        const isTypeHierarchy = type && type == HomoTypeEnum.HIERARCHY;
        if (isTypeHierarchy) {
          await hierarchyCreateHomo({
            homogeneousGroupId: homogeneousGroupId,
            companyId: upsertRiskDataDto.companyId,
            homoGroupRepository: this.homoGroupRepository,
            hierarchyRepository: this.hierarchyRepository,
            type,
            workspaceId,
          });
        }
      }),
    )) || [];

    delete upsertRiskDataDto.workspaceIds;
    delete upsertRiskDataDto.workspaceId;
    delete upsertRiskDataDto.type;
    delete upsertRiskDataDto.recAddOnly;
    delete upsertRiskDataDto.admsAddOnly;
    delete upsertRiskDataDto.generateSourcesAddOnly;
    delete upsertRiskDataDto.engsAddOnly;
    delete upsertRiskDataDto.episCas;
    delete upsertRiskDataDto.removeRecs;
    delete upsertRiskDataDto.removeAdms;
    delete upsertRiskDataDto.removeEngs;
    delete upsertRiskDataDto.removeGenerateSources;
    delete upsertRiskDataDto.removeEpisCas;

    if ('startDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.startDate) upsertRiskDataDto.startDate = null;
    }

    if ('endDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.endDate) upsertRiskDataDto.endDate = null;
    }

    const risksDataMany =
      (await Promise.all(
        upsertRiskDataDto.riskIds.map(async (riskId) => {
          return await this.riskDataRepository.upsertConnectMany({
            ...upsertRiskDataDto,
            riskId,
          });
        }),
      )) || [];

    if (upsertRiskDataDto.riskId) risksDataMany.push(await this.riskDataRepository.upsertMany(upsertRiskDataDto));

    if (upsertRiskDataDto.exams)
      this.checkEmployeeExamService.execute({
        homogeneousGroupIds: upsertRiskDataDto.homogeneousGroupIds,
        companyId: upsertRiskDataDto.companyId,
      });

    this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: upsertRiskDataDto.companyId,
          hierarchyHistory: {
            some: {
              hierarchy: {
                hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: upsertRiskDataDto.homogeneousGroupIds } } },
              },
            },
          },
        },
      },
    });

    // const emptyRiskDataIds = risksDataMany.reduce((acc, riskDataSlice) => {
    //   return [
    //     ...acc,
    //     ...riskDataSlice
    //       .map((riskData) => {
    //         const isEmpty =
    //           riskData.adms.length === 0 &&
    //           riskData.recs.length === 0 &&
    //           riskData.engs.length === 0 &&
    //           riskData.epis.length === 0 &&
    //           riskData.generateSources.length === 0 &&
    //           !riskData.probability;

    //         if (isEmpty) {
    //           return riskData.id;
    //         }
    //         return;
    //       })
    //       .filter((id) => id),
    //   ];
    // }, [] as string[]);

    // await this.riskDataRepository.deleteByIds(emptyRiskDataIds);

    // Process AddOnly fields if present
    const hasAddOnlyFields = recAddOnly?.length > 0 || admsAddOnly?.length > 0 || generateSourcesAddOnly?.length > 0 || engsAddOnly?.length > 0 || episCas?.length > 0;

    if (hasAddOnlyFields) {
      // Apply AddOnly fields to all created risk data
      await Promise.all(
        risksDataMany.flat().map(async (riskData) => {
          await this.updateAddOnlyFields(
            {
              recAddOnly,
              admsAddOnly,
              generateSourcesAddOnly,
              engsAddOnly,
              episCas,
              companyId: upsertRiskDataDto.companyId,
            },
            riskData,
          );
        }),
      );
    }

    // Process Remove fields if present
    const hasRemoveFields = removeRecs?.length > 0 || removeAdms?.length > 0 || removeEngs?.length > 0 || removeGenerateSources?.length > 0 || removeEpisCas?.length > 0;

    if (hasRemoveFields) {
      // Apply Remove fields to all created risk data
      await Promise.all(
        risksDataMany.flat().map(async (riskData) => {
          await this.removeFields(
            {
              removeRecs,
              removeAdms,
              removeEngs,
              removeGenerateSources,
              removeEpisCas,
              companyId: upsertRiskDataDto.companyId,
            },
            riskData,
          );
        }),
      );
    }

    return risksDataMany;
  }

  // Same logic as UpsertRiskDataService.updateAddOnlyFields
  private async updateAddOnlyFields(dto: any, riskData: any) {
    const { recAddOnly, admsAddOnly, generateSourcesAddOnly, engsAddOnly, episCas, companyId } = dto;
    const riskId = riskData.riskId;

    // Fetch the complete risk data with all relationships
    const existingRiskData = await this.prisma.riskFactorData.findFirst({
      where: { id: riskData.id },
      include: {
        recs: { include: { recMed: true } },
        adms: true,
        engsToRiskFactorData: { include: { recMed: true } },
        generateSources: true,
        epiToRiskFactorData: { include: { epi: true } },
      },
    });

    if (!existingRiskData) {
      throw new Error(`RiskData ${riskData.id} não encontrado`);
    }

    // Handle recAddOnly (Recommendations)
    if (recAddOnly && recAddOnly.length > 0) {
      for (const recData of recAddOnly) {
        // Find existing RecMed or create new one
        let recMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: riskId,
            OR: [{ recName: recData.recName || 'no-id' }, { medName: recData.medName || 'no-id' }],
            companyId: companyId,
          },
        });

        if (!recMed) {
          recMed = await this.prisma.recMed.create({
            data: {
              riskId: riskId,
              recName: recData.recName,
              medName: recData.medName,
              companyId: companyId,
              medType: recData.medType,
              recType: recData.recType,
              status: recData.status || 'ACTIVE',
              system: false,
            },
          });
        } else {
          // Update existing RecMed
          recMed = await this.prisma.recMed.update({
            where: { id: recMed.id },
            data: {
              medType: recData.medType,
              recType: recData.recType,
              status: recData.status,
            },
          });
        }

        // Connect to risk data if not already connected
        const existingConnection = await this.prisma.recMedOnRiskData.findUnique({
          where: {
            rec_med_id_risk_data_id: {
              rec_med_id: recMed.id,
              risk_data_id: existingRiskData.id,
            },
          },
        });

        if (!existingConnection) {
          await this.prisma.recMedOnRiskData.create({
            data: {
              rec_med_id: recMed.id,
              risk_data_id: existingRiskData.id,
            },
          });
        }
      }
    }

    // Handle generateSourcesAddOnly
    if (generateSourcesAddOnly && generateSourcesAddOnly.length > 0) {
      for (const sourceData of generateSourcesAddOnly) {
        // Find existing GenerateSource or create new one
        let generateSource = await this.prisma.generateSource.findFirst({
          where: {
            riskId: riskId,
            name: sourceData.name,
            companyId: companyId,
          },
        });

        if (!generateSource) {
          generateSource = await this.prisma.generateSource.create({
            data: {
              riskId: riskId,
              name: sourceData.name,
              companyId: companyId,
              status: sourceData.status || 'ACTIVE',
              system: false,
            },
          });
        }

        // Check if already connected
        const isAlreadyConnected = existingRiskData.generateSources.some((gs) => gs.id === generateSource.id);

        if (!isAlreadyConnected) {
          await this.prisma.riskFactorData.update({
            where: { id: existingRiskData.id },
            data: {
              generateSources: {
                connect: { id: generateSource.id },
              },
            },
          });
        }
      }
    }

    // Handle admsAddOnly (Administrative Measures)
    if (admsAddOnly && admsAddOnly.length > 0) {
      for (const admData of admsAddOnly) {
        // Find existing RecMed or create new one
        let admMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: riskId,
            OR: [{ recName: admData.recName || 'no-id' }, { medName: admData.medName || 'no-id' }],
            companyId: companyId,
          },
        });

        if (!admMed) {
          admMed = await this.prisma.recMed.create({
            data: {
              riskId: riskId,
              recName: admData.recName,
              medName: admData.medName,
              companyId: companyId,
              medType: admData.medType,
              recType: admData.recType,
              status: admData.status || 'ACTIVE',
              system: false,
            },
          });
        } else {
          // Update existing RecMed
          admMed = await this.prisma.recMed.update({
            where: { id: admMed.id },
            data: {
              medType: admData.medType,
              recType: admData.recType,
              status: admData.status,
            },
          });
        }

        // Check if already connected as adm
        const isAlreadyConnected = existingRiskData.adms.some((adm) => adm.id === admMed.id);

        if (!isAlreadyConnected) {
          await this.prisma.riskFactorData.update({
            where: { id: existingRiskData.id },
            data: {
              adms: {
                connect: { id: admMed.id },
              },
            },
          });
        }
      }
    }

    // Handle engsAddOnly (Engineering Measures)
    if (engsAddOnly && engsAddOnly.length > 0) {
      for (const engData of engsAddOnly) {
        // Find existing RecMed or create new one
        let engMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: riskId,
            OR: [{ recName: engData.recName || 'no-id' }, { medName: engData.medName || 'no-id' }],
            companyId: companyId,
          },
        });

        if (!engMed) {
          engMed = await this.prisma.recMed.create({
            data: {
              riskId: riskId,
              recName: engData.recName,
              medName: engData.medName,
              companyId: companyId,
              medType: engData.medType,
              recType: engData.recType,
              status: engData.status || 'ACTIVE',
              system: false,
            },
          });
        } else {
          // Update existing RecMed
          engMed = await this.prisma.recMed.update({
            where: { id: engMed.id },
            data: {
              medType: engData.medType,
              recType: engData.recType,
              status: engData.status,
            },
          });
        }

        // Check if connection already exists
        const existingConnection = await this.prisma.engsToRiskFactorData.findUnique({
          where: {
            riskFactorDataId_recMedId: {
              riskFactorDataId: existingRiskData.id,
              recMedId: engMed.id,
            },
          },
        });

        if (!existingConnection) {
          await this.prisma.engsToRiskFactorData.create({
            data: {
              riskFactorDataId: existingRiskData.id,
              recMedId: engMed.id,
              efficientlyCheck: false,
            },
          });
        }
      }
    }

    // Handle episCas (EPIs by CA code)
    if (episCas && episCas.length > 0) {
      const notFoundCas: string[] = [];

      for (const ca of episCas) {
        // Find EPI by CA code
        const epi = await this.prisma.epi.findFirst({
          where: {
            ca: ca,
            status: 'ACTIVE',
          },
        });

        if (!epi) {
          notFoundCas.push(ca);
          continue;
        }

        // Check if connection already exists
        const existingConnection = await this.prisma.epiToRiskFactorData.findUnique({
          where: {
            riskFactorDataId_epiId: {
              epiId: epi.id,
              riskFactorDataId: existingRiskData.id,
            },
          },
        });

        if (!existingConnection) {
          await this.prisma.epiToRiskFactorData.create({
            data: {
              epiId: epi.id,
              riskFactorDataId: existingRiskData.id,
              efficientlyCheck: false,
              epcCheck: false,
              longPeriodsCheck: false,
              maintenanceCheck: false,
              sanitationCheck: false,
              tradeSignCheck: false,
              trainingCheck: false,
              unstoppedCheck: false,
              validationCheck: false,
            },
          });
        }
      }

      // If any CAs were not found, throw an error
      if (notFoundCas.length > 0) {
        throw new Error(`EPIs com os seguintes códigos CA não foram encontrados: ${notFoundCas.join(', ')}. Verifique se os códigos estão corretos e se os EPIs estão cadastrados no sistema.`);
      }
    }
  }

  // Remove fields by name
  private async removeFields(dto: any, riskData: any) {
    const { removeRecs, removeAdms, removeEngs, removeGenerateSources, removeEpisCas, companyId } = dto;
    const riskId = riskData.riskId;

    // Fetch the complete risk data with all relationships
    const existingRiskData = await this.prisma.riskFactorData.findFirst({
      where: { id: riskData.id },
      include: {
        recs: { include: { recMed: true } },
        adms: true,
        engsToRiskFactorData: { include: { recMed: true } },
        generateSources: true,
        epiToRiskFactorData: { include: { epi: true } },
      },
    });

    if (!existingRiskData) {
      throw new Error(`RiskData ${riskData.id} não encontrado`);
    }

    // Remove Recommendations by name
    if (removeRecs && removeRecs.length > 0) {
      for (const recName of removeRecs) {
        // Find the RecMed by name
        const recMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: riskId,
            recName: recName,
            companyId: companyId,
          },
        });

        if (recMed) {
          // Delete the junction table entry
          await this.prisma.recMedOnRiskData.deleteMany({
            where: {
              rec_med_id: recMed.id,
              risk_data_id: existingRiskData.id,
            },
          });
        }
      }
    }

    // Remove Administrative Measures by name
    if (removeAdms && removeAdms.length > 0) {
      for (const admName of removeAdms) {
        // Find the RecMed by medName
        const recMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: riskId,
            medName: admName,
            companyId: companyId,
          },
        });

        if (recMed) {
          // Delete the junction table entry
          await this.prisma.recMedOnRiskData.deleteMany({
            where: {
              rec_med_id: recMed.id,
              risk_data_id: existingRiskData.id,
            },
          });
        }
      }
    }

    // Remove Engineering Measures by name
    if (removeEngs && removeEngs.length > 0) {
      for (const engName of removeEngs) {
        // Find the RecMed by medName
        const recMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: riskId,
            medName: engName,
            companyId: companyId,
          },
        });

        if (recMed) {
          // Delete the junction table entry for engineering measures
          await this.prisma.engsToRiskFactorData.deleteMany({
            where: {
              recMedId: recMed.id,
              riskFactorDataId: existingRiskData.id,
            },
          });
        }
      }
    }

    // Remove Generate Sources by name
    if (removeGenerateSources && removeGenerateSources.length > 0) {
      for (const sourceName of removeGenerateSources) {
        // Find the GenerateSource by name
        const source = await this.prisma.generateSource.findFirst({
          where: {
            riskId: riskId,
            name: sourceName,
            companyId: companyId,
          },
        });

        if (source) {
          // Disconnect the generate source from risk data
          await this.prisma.riskFactorData.update({
            where: { id: existingRiskData.id },
            data: {
              generateSources: {
                disconnect: { id: source.id },
              },
            },
          });
        }
      }
    }

    // Remove EPIs by CA code
    if (removeEpisCas && removeEpisCas.length > 0) {
      for (const ca of removeEpisCas) {
        // Find EPI by CA code
        const epi = await this.prisma.epi.findFirst({
          where: {
            ca: ca,
          },
        });

        if (epi) {
          // Delete the junction table entry
          await this.prisma.epiToRiskFactorData.deleteMany({
            where: {
              epiId: epi.id,
              riskFactorDataId: existingRiskData.id,
            },
          });
        }
      }
    }
  }
}
