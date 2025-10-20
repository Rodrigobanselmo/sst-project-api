import { Injectable } from '@nestjs/common';
import { HomoTypeEnum } from '@prisma/client';

import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../company/repositories/implementations/HomoGroupRepository';
import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';
import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { RiskGroupDataRepository } from './../../../../../modules/sst/repositories/implementations/RiskGroupDataRepository';
import { PrismaService } from '../../../../../prisma/prisma.service';

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
  ) {}

  async execute(upsertRiskDataDto: UpsertRiskDataDto) {
    console.log('upsertRiskDataDto', upsertRiskDataDto);
    const keepEmpty = upsertRiskDataDto.keepEmpty;
    const workspaceId = upsertRiskDataDto.workspaceId;
    const type = upsertRiskDataDto.type;
    const { recAddOnly, admsAddOnly, generateSourcesAddOnly, engsAddOnly } = upsertRiskDataDto;

    delete upsertRiskDataDto.keepEmpty;
    delete upsertRiskDataDto.workspaceId;
    delete upsertRiskDataDto.type;
    delete upsertRiskDataDto.recAddOnly;
    delete upsertRiskDataDto.admsAddOnly;
    delete upsertRiskDataDto.generateSourcesAddOnly;
    delete upsertRiskDataDto.engsAddOnly;

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
    const hasAddOnlyFields = recAddOnly?.length > 0 || admsAddOnly?.length > 0 || generateSourcesAddOnly?.length > 0 || engsAddOnly?.length > 0;

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
      };

      await this.updateAddOnlyFields(addOnlyDto, riskData);
    }

    return riskData;
  }

  async updateAddOnlyFields(upsertRiskDataDto: UpsertRiskDataDto, riskData: any) {
    const { recAddOnly, admsAddOnly, generateSourcesAddOnly, engsAddOnly, ...restDto } = upsertRiskDataDto;

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

    // Handle recAddOnly
    if (recAddOnly && recAddOnly.length > 0) {
      for (const recData of recAddOnly) {
        // Find existing RecMed or create new one
        let recMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: restDto.riskId,
            OR: [{ recName: recData.recName || 'no-id' }, { medName: recData.medName || 'no-id' }],
            companyId: restDto.companyId,
          },
        });

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

    // Handle admsAddOnly
    if (admsAddOnly && admsAddOnly.length > 0) {
      for (const admData of admsAddOnly) {
        // Find existing RecMed or create new one
        let admMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: restDto.riskId,
            OR: [{ recName: admData.recName || 'no-id' }, { medName: admData.medName || 'no-id' }],
            companyId: restDto.companyId,
          },
        });

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
        // Find existing GenerateSource or create new one
        let generateSource = await this.prisma.generateSource.findFirst({
          where: {
            riskId: restDto.riskId,
            name: sourceData.name,
            companyId: restDto.companyId,
          },
        });

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
        // Find existing RecMed or create new one
        let recMed = await this.prisma.recMed.findFirst({
          where: {
            riskId: restDto.riskId,
            OR: [{ recName: engData.recName || 'no-id' }, { medName: engData.medName || 'no-id' }],
            companyId: restDto.companyId,
          },
        });

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
