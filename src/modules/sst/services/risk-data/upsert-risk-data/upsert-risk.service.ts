import { Injectable } from '@nestjs/common';
import { HomoTypeEnum, RiskCatalogKind } from '@prisma/client';

import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../company/repositories/implementations/HomoGroupRepository';
import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';
import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { RiskGroupDataRepository } from './../../../../../modules/sst/repositories/implementations/RiskGroupDataRepository';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { SyncMissingDerivedMeasureAfterRecMedUpdateService } from '../../rec-med/sync-missing-derived-measure-after-rec-med-update/sync-missing-derived-measure-after-rec-med-update.service';
import { tryPromoteResidualToCurrentWhenPlanFullyImplemented } from '../../../../../@v2/security/action-plan/database/utils/try-promote-residual-to-current-when-plan-fully-implemented';
import {
  findGenerateSourceByNormalizedName,
  findRecMedByNormalizedName,
  sanitizeRecAddOnlyItems,
} from '@/shared/utils/normalize-inventory-item-name.util';
import { RiskCatalogEquivalenceService } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.service';
import {
  resolveGenerateSourceEntityToCanonical,
  resolveRecMedEntityToCanonical,
} from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence-resolve.helper';
import {
  buildGenerateSourceCatalogVisibilityWhere,
  buildRecMedCatalogVisibilityWhere,
} from '@/shared/utils/risk-catalog-visibility.util';

@Injectable()
export class UpsertRiskDataService {
  constructor(
    private readonly riskDataRepository: RiskDataRepository,
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
    private readonly prisma: PrismaService,
    private readonly syncMissingDerivedMeasureAfterRecMedUpdate: SyncMissingDerivedMeasureAfterRecMedUpdateService,
    private readonly riskCatalogEquivalenceService: RiskCatalogEquivalenceService,
  ) {}

  /**
   * Fluxo da tela de Caracterização salva por `POST /risk-data` e pode regravar `probability`.
   * Para manter a regra do Plano de Ação, tenta re-promover residual->atual em todos
   * os workspaces que tenham itens de plano para este risco-dado.
   */
  private async tryPromoteFromExistingPlanWorkspaces(
    riskFactorDataId: string,
    companyId: string,
  ): Promise<void> {
    const workspaceRows = await this.prisma.riskFactorDataRec.findMany({
      where: { riskFactorDataId, companyId },
      select: { workspaceId: true },
      distinct: ['workspaceId'],
    });
    if (!workspaceRows.length) return;

    await this.prisma.$transaction(async (tx) => {
      for (const row of workspaceRows) {
        await tryPromoteResidualToCurrentWhenPlanFullyImplemented(tx, {
          riskFactorDataId,
          workspaceId: row.workspaceId,
          companyId,
        });
      }
    });
  }

  async execute(upsertRiskDataDto: UpsertRiskDataDto) {
    const keepEmpty = upsertRiskDataDto.keepEmpty;
    const workspaceId = upsertRiskDataDto.workspaceId;
    const type = upsertRiskDataDto.type;
    const { recAddOnly, admsAddOnly, generateSourcesAddOnly, engsAddOnly, episCas } = upsertRiskDataDto;

    delete upsertRiskDataDto.keepEmpty;
    delete upsertRiskDataDto.workspaceId;
    delete upsertRiskDataDto.type;
    delete upsertRiskDataDto.recAddOnly;
    delete upsertRiskDataDto.admsAddOnly;
    delete upsertRiskDataDto.generateSourcesAddOnly;
    delete upsertRiskDataDto.engsAddOnly;
    delete upsertRiskDataDto.episCas;

    if ('startDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.startDate) upsertRiskDataDto.startDate = null;
    }

    if ('endDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.endDate) upsertRiskDataDto.endDate = null;
    }

    const isTypeHierarchy = type && type == HomoTypeEnum.HIERARCHY;
    if (isTypeHierarchy)
      await hierarchyCreateHomo({
        homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId,
        companyId: upsertRiskDataDto.companyId,
        homoGroupRepository: this.homoGroupRepository,
        hierarchyRepository: this.hierarchyRepository,
        type,
        workspaceId,
      });

    if (!upsertRiskDataDto.riskFactorGroupDataId) {
      const riskGroupData = await this.riskGroupDataRepository.findAllByCompany(upsertRiskDataDto.companyId);
      upsertRiskDataDto.riskFactorGroupDataId = riskGroupData[0]?.id;
    }

    const riskData = await this.riskDataRepository.upsert(upsertRiskDataDto);

    if (upsertRiskDataDto.exams)
      this.checkEmployeeExamService.execute({
        homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId,
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
                hierarchyOnHomogeneous: { some: { homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId } },
              },
            },
          },
        },
      },
    });

    if (!keepEmpty) {
      const isEmpty =
        riskData.adms.length === 0 &&
        riskData.recs.length === 0 &&
        riskData.engs.length === 0 &&
        riskData.epis.length === 0 &&
        riskData.exams.length === 0 &&
        riskData.generateSources.length === 0 &&
        !riskData.endDate &&
        !riskData.startDate &&
        !riskData.probability;

      if (isEmpty) {
        await this.riskDataRepository.deleteById(riskData.id);
        return riskData.id;
      }
    }

    // Check if there are any "add only" fields to process
    const hasAddOnlyFields = recAddOnly?.length > 0 || admsAddOnly?.length > 0 || generateSourcesAddOnly?.length > 0 || engsAddOnly?.length > 0 || episCas?.length > 0;

    if (hasAddOnlyFields) {
      // Reconstruct the original DTO with add only fields for processing
      const addOnlyDto = {
        ...upsertRiskDataDto,
        riskId: upsertRiskDataDto.riskId,
        homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId,
        companyId: upsertRiskDataDto.companyId,
        riskFactorGroupDataId: upsertRiskDataDto.riskFactorGroupDataId,
        recAddOnly,
        admsAddOnly,
        generateSourcesAddOnly,
        engsAddOnly,
        episCas,
      };

      await this.updateAddOnlyFields(addOnlyDto, riskData);
    }

    await this.tryPromoteFromExistingPlanWorkspaces(
      riskData.id,
      upsertRiskDataDto.companyId,
    );

    return riskData;
  }

  async updateAddOnlyFields(upsertRiskDataDto: UpsertRiskDataDto, riskData: any) {
    const { recAddOnly, admsAddOnly, generateSourcesAddOnly, engsAddOnly, episCas, ...restDto } = upsertRiskDataDto;

    // Fetch the complete risk data with all relationships
    const existingRiskData = await this.prisma.riskFactorData.findFirst({
      where: { id: riskData.id },
      include: {
        recs: { include: { recMed: true } },
        adms: true,
        generateSources: true,
        engsToRiskFactorData: { include: { recMed: true } },
      },
    });

    if (!existingRiskData) {
      throw new Error('Risk data not found');
    }

    const hasCatalogLookups =
      (recAddOnly?.length ?? 0) > 0 ||
      (admsAddOnly?.length ?? 0) > 0 ||
      (generateSourcesAddOnly?.length ?? 0) > 0 ||
      (engsAddOnly?.length ?? 0) > 0;

    const riskFactor = hasCatalogLookups
      ? await this.prisma.riskFactors.findUnique({
          where: { id: restDto.riskId },
          select: { type: true },
        })
      : null;

    const [generateSourceCandidates, recMedCandidates] = hasCatalogLookups
      ? await Promise.all([
          this.prisma.generateSource.findMany({
            where: buildGenerateSourceCatalogVisibilityWhere({
              riskId: restDto.riskId,
              companyId: restDto.companyId,
            }),
            select: {
              id: true,
              name: true,
              companyId: true,
              system: true,
              status: true,
            },
          }),
          this.prisma.recMed.findMany({
            where: buildRecMedCatalogVisibilityWhere({
              riskId: restDto.riskId,
              companyId: restDto.companyId,
              riskType: riskFactor?.type,
            }),
            select: {
              id: true,
              recName: true,
              medName: true,
              companyId: true,
              system: true,
              medType: true,
              recType: true,
              status: true,
            },
          }),
        ])
      : [[], []];

    const [generateSourceAliasMap, recMedAliasMap] = hasCatalogLookups
      ? await Promise.all([
          this.riskCatalogEquivalenceService.buildCanonicalCatalogMap(
            RiskCatalogKind.GENERATE_SOURCE,
            restDto.riskId,
          ),
          this.riskCatalogEquivalenceService.buildCanonicalCatalogMap(
            RiskCatalogKind.REC_MED,
            restDto.riskId,
          ),
        ])
      : [new Map<string, string>(), new Map<string, string>()];

    // Handle recAddOnly — descarta recomendações sem texto válido em recName
    const sanitizedRecAddOnly = sanitizeRecAddOnlyItems(recAddOnly);
    if (sanitizedRecAddOnly.length > 0) {
      for (const recData of sanitizedRecAddOnly) {
        let recMed = findRecMedByNormalizedName(
          recMedCandidates,
          recData,
          restDto.companyId,
        );

        if (!recMed) {
          recMed = await this.prisma.recMed.create({
            data: {
              riskId: restDto.riskId,
              recName: recData.recName,
              medName: recData.medName,
              companyId: restDto.companyId,
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

        recMed = await resolveRecMedEntityToCanonical(
          this.prisma,
          this.riskCatalogEquivalenceService,
          recMed,
          recMedAliasMap,
        );

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

        if (recData.recType != null) {
          await this.syncMissingDerivedMeasureAfterRecMedUpdate.execute(recMed.id, restDto.companyId);
        }
      }
    }

    // Handle admsAddOnly
    if (admsAddOnly && admsAddOnly.length > 0) {
      for (const admData of admsAddOnly) {
        let admMed = findRecMedByNormalizedName(
          recMedCandidates,
          admData,
          restDto.companyId,
        );

        if (!admMed) {
          admMed = await this.prisma.recMed.create({
            data: {
              riskId: restDto.riskId,
              recName: admData.recName,
              medName: admData.medName,
              companyId: restDto.companyId,
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

        admMed = await resolveRecMedEntityToCanonical(
          this.prisma,
          this.riskCatalogEquivalenceService,
          admMed,
          recMedAliasMap,
        );

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

    // Handle generateSourcesAddOnly
    if (generateSourcesAddOnly && generateSourcesAddOnly.length > 0) {
      for (const sourceData of generateSourcesAddOnly) {
        let generateSource = findGenerateSourceByNormalizedName(
          generateSourceCandidates,
          sourceData.name,
          restDto.companyId,
        );

        if (!generateSource) {
          generateSource = await this.prisma.generateSource.create({
            data: {
              riskId: restDto.riskId,
              name: sourceData.name,
              companyId: restDto.companyId,
              status: sourceData.status || 'ACTIVE',
              system: false,
            },
          });
        } else {
          // Update existing GenerateSource
          generateSource = await this.prisma.generateSource.update({
            where: { id: generateSource.id },
            data: {
              status: sourceData.status,
            },
          });
        }

        generateSource = await resolveGenerateSourceEntityToCanonical(
          this.prisma,
          this.riskCatalogEquivalenceService,
          generateSource,
          generateSourceAliasMap,
        );

        // Check if already connected to risk data
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

    // Handle engsAddOnly
    if (engsAddOnly && engsAddOnly.length > 0) {
      for (const engData of engsAddOnly) {
        let recMed = findRecMedByNormalizedName(
          recMedCandidates,
          engData,
          restDto.companyId,
        );

        if (!recMed) {
          recMed = await this.prisma.recMed.create({
            data: {
              riskId: restDto.riskId,
              recName: engData.recName,
              medName: engData.medName,
              companyId: restDto.companyId,
              medType: engData.medType,
              recType: engData.recType,
              status: engData.status || 'ACTIVE',
              system: false,
            },
          });
        } else {
          // Update existing RecMed
          recMed = await this.prisma.recMed.update({
            where: { id: recMed.id },
            data: {
              medType: engData.medType,
              recType: engData.recType,
              status: engData.status,
            },
          });
        }

        recMed = await resolveRecMedEntityToCanonical(
          this.prisma,
          this.riskCatalogEquivalenceService,
          recMed,
          recMedAliasMap,
        );

        // Check if already connected to risk data as engineering measure
        const existingConnection = await this.prisma.engsToRiskFactorData.findUnique({
          where: {
            riskFactorDataId_recMedId: {
              riskFactorDataId: existingRiskData.id,
              recMedId: recMed.id,
            },
          },
        });

        if (!existingConnection) {
          await this.prisma.engsToRiskFactorData.create({
            data: {
              riskFactorDataId: existingRiskData.id,
              recMedId: recMed.id,
              efficientlyCheck: false, // Default value since UpdateRecMedDto doesn't have this field
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
          continue; // Skip this CA and continue with others
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

      // If any CAs were not found, throw an error to notify the user
      if (notFoundCas.length > 0) {
        throw new Error(`EPIs com os seguintes códigos CA não foram encontrados: ${notFoundCas.join(', ')}. ` + `Verifique se os códigos estão corretos e se os EPIs estão cadastrados no sistema.`);
      }
    }
  }

}

export const hierarchyCreateHomo = async ({
  homoGroupRepository,
  hierarchyRepository,
  type = 'HIERARCHY',
  workspaceId,
  homogeneousGroupId,
  companyId,
}: {
  homoGroupRepository: HomoGroupRepository;
  hierarchyRepository: HierarchyRepository;
  type?: 'HIERARCHY';
  workspaceId?: string;
  homogeneousGroupId: string;
  companyId: string;
}) => {
  const homo = await homoGroupRepository.findHomoGroupByCompanyAndId(homogeneousGroupId, companyId);

  if (!homo?.id) {
    const hierarchy = await hierarchyRepository.findAllHierarchyByCompanyAndId(homogeneousGroupId, companyId);

    if (hierarchy?.id) {
      const gho = await homoGroupRepository.create(
        {
          companyId: companyId,
          description: '',
          name: hierarchy.id,
          type: type,
          id: hierarchy.id,
          workspaceIds: hierarchy.workspaceIds,
        },
        companyId,
      );

      await hierarchyRepository.upsertMany(
        [
          {
            ghoName: gho.name,
            companyId: companyId,
            id: hierarchy.id,
            name: hierarchy.name,
            status: hierarchy.status,
            type: hierarchy.type,
            workspaceIds: hierarchy.workspaceIds,
          },
        ],
        companyId,
      );
    }
  }
};
