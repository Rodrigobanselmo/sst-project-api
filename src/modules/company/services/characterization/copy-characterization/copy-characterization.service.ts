import { CopyCharacterizationDto } from './../../../dto/characterization.dto';
import { HomoGroupEntity } from '../../../entities/homoGroup.entity';
import { isEnvironment } from 'src/shared/utils/isEnvironment';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum, HomogeneousGroup, HomoTypeEnum } from '@prisma/client';
import { v4 } from 'uuid';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { HierarchyEntity } from '../../../entities/hierarchy.entity';
import { WorkspaceEntity } from '../../../entities/workspace.entity';
import { HierarchyRepository } from '../../../repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';

@Injectable()
export class CopyCharacterizationService {
  constructor(private readonly prisma: PrismaService, private readonly homoGroupRepository: HomoGroupRepository) { }
  async execute({ companyCopyFromId, workspaceId, characterizationIds }: CopyCharacterizationDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const sameCompany = companyId === companyCopyFromId;
    const isMaster = user.isMaster;
    // a lele ama o digo
    const actualCompany = await this.prisma.company.findFirst({
      where: {
        id: companyId,
      },
      include: {
        riskFactorGroupData: true,
      },
    });

    const company = await this.prisma.company.findFirst({
      where: {
        id: companyCopyFromId,
        ...(!isMaster &&
          !sameCompany && {
          receivingServiceContracts: {
            some: { applyingServiceCompanyId: user.companyId },
          },
        }),
      },
    });

    if (!company?.id) throw new BadRequestException('Empresa não encontrado');

    const homoGroups = await this.homoGroupRepository.findHomoGroupByCompany(companyCopyFromId, {
      where: {
        characterization: {
          OR: [{ id: { in: characterizationIds } }, { profileParentId: { in: characterizationIds } }],
        },
      },
      include: {
        characterization: {
          include: {
            // photos: true,
            profiles: {
              include: {
                homogeneousGroup: true,
              },
            },
          },
        },
        // environment: true,
        riskFactorData: {
          include: {
            adms: true,
            recs: true,
            generateSources: true,
            epiToRiskFactorData: { include: { epi: true } },
            engsToRiskFactorData: { include: { recMed: true } },
            hierarchy: true,
            riskFactor: true,
            probabilityCalc: true,
            probabilityAfterCalc: true,
          },
        },
      },
    });

    const createHomogeneous = async (homoGroupsCreation: HomoGroupEntity[], profileParentId?: string) => {
      homoGroupsCreation.map((homoGroup, i) => {
        homoGroup.characterization.name = homoGroup.characterization.name + ' [CÓPIA]';

        if (homoGroup.characterization && isEnvironment(homoGroup.characterization.type)) {
          homoGroupsCreation[i].environment = homoGroup.characterization as any;
          // homoGroupsCreation[i].characterization = null;
        }
      });

      await Promise.all(
        homoGroupsCreation.map(async (group) => {
          if (!profileParentId && group?.characterization?.profileParentId) return; //log('skip profile');
          if (profileParentId && !group?.characterization?.profileParentId) return; //log('skip not profile');

          if (group.characterization && isEnvironment(group.characterization.type)) group.environment = group.characterization;

          let newHomoGroup: HomogeneousGroup;
          const newHomoGroupId = v4();

          const createUpdateHomo = async (_newHomoGroupId: string) => {
            newHomoGroup = await this.prisma.homogeneousGroup.create({
              data: {
                id: _newHomoGroupId,
                description: group.description,
                name: _newHomoGroupId,
                companyId: companyId,
                type: group.type,
                ...(workspaceId && { workspaces: { connect: [workspaceId].map((id) => ({ id_companyId: { id, companyId } })) } }),
              },
            });
          };

          const createRiskFactorData = async (_newHomoGroupId) => {
            await Promise.all(
              group.riskFactorData.map(async (riskFactorFromData) => {
                const newRiskFactorData = await this.prisma.riskFactorData.create({
                  data: {
                    homogeneousGroupId: _newHomoGroupId,
                    riskId: riskFactorFromData.riskId,
                    riskFactorGroupDataId: actualCompany.riskFactorGroupData[0].id,
                    probabilityAfter: riskFactorFromData.probabilityAfter,
                    probability: riskFactorFromData.probability,
                    json: riskFactorFromData.json || undefined,
                    // probabilityAfterCalc: {create:{chancesOfHappening:riskFactorFromData.probabilityAfter}}, //! missing this
                    companyId,
                    generateSources:
                      riskFactorFromData.generateSources && riskFactorFromData.generateSources.length
                        ? {
                          connect: riskFactorFromData.generateSources.map(({ id }) => ({
                            id,
                          })),
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
                  },
                });

                if (riskFactorFromData.epiToRiskFactorData && riskFactorFromData.epiToRiskFactorData.length)
                  await this.prisma.epiToRiskFactorData.createMany({
                    data: riskFactorFromData.epiToRiskFactorData.map(({ epi, ...data }) => ({
                      ...data,
                      riskFactorDataId: newRiskFactorData.id,
                    })),
                  });

                if (riskFactorFromData.engsToRiskFactorData && riskFactorFromData.engsToRiskFactorData.length)
                  await this.prisma.engsToRiskFactorData.createMany({
                    data: riskFactorFromData.engsToRiskFactorData.map(({ recMed, ...data }) => ({
                      ...data,
                      riskFactorDataId: newRiskFactorData.id,
                    })),
                  });

                return newRiskFactorData;
              }),
            );
          };

          await createUpdateHomo(newHomoGroupId);

          if (group.characterization) {
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
                profileName: group.characterization.profileName,
                profileParentId: profileParentId || undefined,
                order: group.characterization.order,
                workspaceId: workspaceId,
              },
            });

            //! don't include photos
            // if (group.characterization.photos)
            //   await this.prisma.companyCharacterizationPhoto.createMany({
            //     data: group.characterization.photos.map(
            //       ({ id, created_at, updated_at, deleted_at, ...photo }) => ({
            //         ...photo,
            //         companyCharacterizationId: newHomoGroup.id,
            //       }),
            //     ),
            //   });
          }

          if (group.riskFactorData && group.riskFactorData.length) {
            await createRiskFactorData(newHomoGroup.id);
          }

          if (group.characterization?.profiles) {
            const profilesHomoGroups = group.characterization.profiles
              .map((profile) => {
                return homoGroups.find((homo) => homo.id === profile.id);
              })
              .filter((i) => i?.id);
            await createHomogeneous(profilesHomoGroups, newHomoGroup.id);
          }
        }),
      );
    };

    await createHomogeneous(homoGroups);

    return {};
  }

  async getCommonHierarchy(targetHierarchies: HierarchyEntity[], fromHierarchies: HierarchyEntity[]) {
    const equalHierarchy: Record<string, HierarchyEntity[]> = {};
    const equalWorkspace: Record<string, WorkspaceEntity> = {};
    [HierarchyEnum.DIRECTORY, HierarchyEnum.MANAGEMENT, HierarchyEnum.SECTOR, HierarchyEnum.SUB_SECTOR, HierarchyEnum.OFFICE, HierarchyEnum.SUB_OFFICE].forEach(
      (hierarchyType) => {
        targetHierarchies.forEach((targetHierarchy) => {
          if (targetHierarchy.type !== hierarchyType) return;

          fromHierarchies.find((hierarchyFrom) => {
            const same = hierarchyFrom.id === targetHierarchy.refName;
            if (same) {
              equalWorkspace[hierarchyFrom.workspaces[0].id] = targetHierarchy.workspaces[0];

              const old = equalHierarchy[hierarchyFrom.id + '//' + hierarchyFrom.workspaces[0].id] || [];

              equalHierarchy[hierarchyFrom.id + '//' + hierarchyFrom.workspaces[0].id] = [targetHierarchy, ...old];
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
      },
    );

    return { equalHierarchy, equalWorkspace };
  }
}
