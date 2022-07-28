import { isEnvironment } from './../../../repositories/implementations/CharacterizationRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum, HomogeneousGroup } from '@prisma/client';
import { v4 } from 'uuid';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { PrismaService } from './../../../../../prisma/prisma.service';
import { RiskGroupDataRepository } from './../../../../checklist/repositories/implementations/RiskGroupDataRepository';
import { HierarchyEntity } from './../../../entities/hierarchy.entity';
import { WorkspaceEntity } from './../../../entities/workspace.entity';
import { HierarchyRepository } from './../../../repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from './../../../repositories/implementations/HomoGroupRepository';

@Injectable()
export class CopyCompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly prisma: PrismaService,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
  ) {}
  async execute(
    companyCopyFromId: string,
    riskGroupFromId: string,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;

    const fromHierarchies =
      await this.hierarchyRepository.findAllHierarchyByCompany(
        companyCopyFromId,
        {
          include: { workspaces: true },
          returnWorkspace: true,
        },
      );

    const targetHierarchies =
      await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
        include: { workspaces: true },
        returnWorkspace: true,
      });

    const { equalHierarchy, equalWorkspace } = await this.getCommonHierarchy(
      targetHierarchies,
      fromHierarchies,
    );

    const company = await this.companyRepository.findById(companyCopyFromId, {
      include: {
        riskFactorGroupData: true,
      },
    });

    const fromRiskDataGroup = company.riskFactorGroupData.find(
      (doc) => riskGroupFromId === doc.id,
    );

    if (!fromRiskDataGroup)
      throw new BadRequestException('Documeto não encontrado');

    const homoGroups = await this.homoGroupRepository.findHomoGroupByCompany(
      companyCopyFromId,
      {
        include: {
          characterization: true,
          environment: true,
          riskFactorData: {
            include: {
              adms: true,
              recs: true,
              engs: true,
              generateSources: true,
              epiToRiskFactorData: { include: { epi: true } },
              hierarchy: true,
              riskFactor: true,
              probabilityCalc: true,
              probabilityAfterCalc: true,
            },
            where: { riskFactorGroupDataId: riskGroupFromId },
          },
        },
      },
    );

    homoGroups.map((homoGroup, i) => {
      if (
        homoGroup.characterization &&
        isEnvironment(homoGroup.characterization.type)
      ) {
        homoGroups[i].environment = homoGroup.characterization as any;
        homoGroups[i].characterization = null;
      }
    });

    const newRiskGroupData = await this.riskGroupDataRepository.upsert({
      companyId,
      approvedBy: fromRiskDataGroup.approvedBy,
      complementaryDocs: fromRiskDataGroup.complementaryDocs,
      complementarySystems: fromRiskDataGroup.complementarySystems,
      coordinatorBy: fromRiskDataGroup.coordinatorBy,
      elaboratedBy: fromRiskDataGroup.elaboratedBy,
      name: fromRiskDataGroup.name,
      professionalsIds:
        fromRiskDataGroup.professionals &&
        fromRiskDataGroup.professionals.length
          ? fromRiskDataGroup.professionals.map((p) => p.id)
          : undefined,
      usersIds:
        fromRiskDataGroup.users && fromRiskDataGroup.users.length
          ? fromRiskDataGroup.users.map((p) => p.id)
          : undefined,
      revisionBy: fromRiskDataGroup.revisionBy,
      source: fromRiskDataGroup.source,
      visitDate: fromRiskDataGroup.visitDate,
      validityEnd: fromRiskDataGroup.validityEnd,
      validityStart: fromRiskDataGroup.validityStart,
    });

    await Promise.all(
      homoGroups.map(async (group) => {
        if (
          group.characterization &&
          isEnvironment(group.characterization.type)
        )
          group.environment = group.characterization;

        const hierarchies: HierarchyEntity[] = [];
        group.hierarchies.map((hierarchy) => {
          group.workspaceIds.map((workspaceId) => {
            const hierarchyFound =
              equalHierarchy[hierarchy.id + '//' + workspaceId];

            if (hierarchyFound && equalWorkspace[workspaceId])
              hierarchyFound.forEach((h) => {
                hierarchies.push({
                  ...h,
                  workspaceId: equalWorkspace[workspaceId].id,
                });
              });
          });
        });

        if (hierarchies.length === 0) return;
        const foundHomo = await this.prisma.homogeneousGroup.findUnique({
          where: {
            name_companyId: { name: group.name, companyId: companyId },
          },
        });

        let newHomoGroup: HomogeneousGroup;
        const newHomoGroupId = v4();

        if (!foundHomo) {
          newHomoGroup = await this.prisma.homogeneousGroup.create({
            data: {
              description: group.description,
              name:
                group.environment || group.characterization
                  ? newHomoGroupId
                  : group.name,
              companyId: companyId,
              type: group.type,
            },
          });
        } else {
          newHomoGroup = await this.prisma.homogeneousGroup.update({
            where: { id: foundHomo.id },
            data: {
              companyId: companyId,
              name:
                group.environment || group.characterization
                  ? foundHomo.id
                  : group.name,
              type: group.type,
              description: foundHomo.description
                ? group.description || undefined
                : undefined,
            },
          });
        }

        if (
          group.environment &&
          equalWorkspace[group.environment.workspaceId]
        ) {
          await this.prisma.companyCharacterization.create({
            data: {
              id: newHomoGroup.id,
              description: group.environment.description,
              name: group.environment.name,
              type: group.environment.type,
              considerations: group.environment.considerations,
              activities: group.environment.activities,
              companyId: companyId,
              workspaceId: equalWorkspace[group.environment.workspaceId].id,
            },
          });
        }

        if (
          group.characterization &&
          equalWorkspace[group.characterization.workspaceId]
        ) {
          await this.prisma.companyCharacterization.create({
            data: {
              id: newHomoGroup.id,
              description: group.characterization.description,
              name: group.characterization.name,
              type: group.characterization.type,
              activities: group.characterization.activities,
              paragraphs: group.characterization.paragraphs,
              considerations: group.characterization.considerations,
              companyId: companyId,
              workspaceId:
                equalWorkspace[group.characterization.workspaceId].id,
            },
          });
        }

        if (group.riskFactorData && group.riskFactorData.length) {
          await Promise.all(
            group.riskFactorData.map(async (riskFactorFromData) => {
              const newRiskFactorData = await this.prisma.riskFactorData.create(
                {
                  data: {
                    homogeneousGroupId: newHomoGroup.id,
                    riskId: riskFactorFromData.riskId,
                    riskFactorGroupDataId: newRiskGroupData.id,
                    probabilityAfter: riskFactorFromData.probabilityAfter,
                    probability: riskFactorFromData.probability,
                    json: riskFactorFromData.json || undefined,
                    // probabilityAfterCalc: {create:{chancesOfHappening:riskFactorFromData.probabilityAfter}}, //! missing this
                    companyId,
                    generateSources:
                      riskFactorFromData.generateSources &&
                      riskFactorFromData.generateSources.length
                        ? {
                            connect: riskFactorFromData.generateSources.map(
                              ({ id }) => ({
                                id,
                              }),
                            ),
                          }
                        : undefined,
                    recs:
                      riskFactorFromData.recs && riskFactorFromData.recs.length
                        ? {
                            connect: riskFactorFromData.recs.map(({ id }) => ({
                              id,
                            })),
                          }
                        : undefined,
                    adms:
                      riskFactorFromData.adms && riskFactorFromData.adms.length
                        ? {
                            connect: riskFactorFromData.adms.map(({ id }) => ({
                              id,
                            })),
                          }
                        : undefined,
                    engs:
                      riskFactorFromData.engs && riskFactorFromData.engs.length
                        ? {
                            connect: riskFactorFromData.engs.map(({ id }) => ({
                              id,
                            })),
                          }
                        : undefined,
                  },
                },
              );

              if (riskFactorFromData.epis && riskFactorFromData.epis.length)
                await this.prisma.epiToRiskFactorData.createMany({
                  data: riskFactorFromData.epiToRiskFactorData.map(
                    ({ epi, ...data }) => ({
                      ...data,
                      riskFactorDataId: newRiskFactorData.id,
                    }),
                  ),
                });

              return newRiskFactorData;
            }),
          );
        }

        await Promise.all(
          hierarchies.map(async (hierarchy) => {
            await this.prisma.hierarchyOnHomogeneous.upsert({
              where: {
                hierarchyId_homogeneousGroupId_workspaceId: {
                  hierarchyId: hierarchy.id,
                  homogeneousGroupId: newHomoGroup.id,
                  workspaceId: hierarchy.workspaceId,
                },
              },
              create: {
                hierarchyId: hierarchy.id,
                homogeneousGroupId: newHomoGroup.id,
                workspaceId: hierarchy.workspaceId,
              },
              update: {},
            });
          }),
        );
      }),
    );

    return {};
  }

  async getCommonHierarchy(
    targetHierarchies: HierarchyEntity[],
    fromHierarchies: HierarchyEntity[],
  ) {
    const equalHierarchy: Record<string, HierarchyEntity[]> = {};
    const equalWorkspace: Record<string, WorkspaceEntity> = {};
    [
      HierarchyEnum.DIRECTORY,
      HierarchyEnum.MANAGEMENT,
      HierarchyEnum.SECTOR,
      HierarchyEnum.SUB_SECTOR,
      HierarchyEnum.OFFICE,
      HierarchyEnum.SUB_OFFICE,
    ].forEach((hierarchyType) => {
      targetHierarchies.forEach((targetHierarchy) => {
        if (targetHierarchy.type !== hierarchyType) return;

        fromHierarchies.find((hierarchyFrom) => {
          const same = hierarchyFrom.id === targetHierarchy.refName;
          if (same) {
            equalWorkspace[hierarchyFrom.workspaces[0].id] =
              targetHierarchy.workspaces[0];

            const old =
              equalHierarchy[
                hierarchyFrom.id + '//' + hierarchyFrom.workspaces[0].id
              ] || [];

            equalHierarchy[
              hierarchyFrom.id + '//' + hierarchyFrom.workspaces[0].id
            ] = [targetHierarchy, ...old];
          }
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // targetHierarchy.workspaces.forEach((workspace) => {
        // fromHierarchies.find((hierarchyFrom) => {
        // if (hierarchyFrom.type !== hierarchyType) return;

        //* check if same hierarchy
        // const sameWorkspaceFrom = hierarchyFrom.workspaces.find(
        //   (workspaceFrom) => {
        //     const isTheSame =
        //       workspaceFrom.name.toLowerCase() ===
        //       workspace.name.toLowerCase();
        //     if (isTheSame) equalWorkspace[workspaceFrom.id] = workspace;

        //     return isTheSame;
        //   },
        // );

        // const sameName =
        //   hierarchyFrom.name.toLowerCase() ===
        //   targetHierarchy.name.toLowerCase();

        // const sameParent = targetHierarchy.parentId
        //   ? equalHierarchy[
        //       hierarchyFrom.parentId + '//' + sameWorkspaceFrom.id
        //     ] &&
        //     equalHierarchy[
        //       hierarchyFrom.parentId + '//' + sameWorkspaceFrom.id
        //     ].id === targetHierarchy.parentId
        //   : true;

        // if (sameWorkspaceFrom && sameName && sameParent) {
        //   equalHierarchy[hierarchyFrom.id + '//' + sameWorkspaceFrom.id] =
        //     targetHierarchy;
        // }
        // });
        // });
      });
    });

    return { equalHierarchy, equalWorkspace };
  }
}
