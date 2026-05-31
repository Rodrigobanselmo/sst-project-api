import { FormApplicationScopeTypeEnum } from '@/@v2/forms/domain/enums/form-application-scope-type.enum';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompanyTypesEnum,
  Hierarchy,
  Prisma,
  StatusEnum,
  Address,
} from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';
import { v4 as uuidV4 } from 'uuid';
import {
  WorkspaceConvertCompanyGroupOption,
  WorkspaceConvertPreviewResult,
  WorkspaceConvertResult,
} from './workspace-convert.types';
import { WorkspaceOperationalDataCloneService } from './workspace-operational-data-clone.service';

const CONFIRMATION_TOKEN = 'CONVERTER';

/** Hierarquia já com seus vínculos de workspace ativos carregados. */
type HierarchyWithWorkspaces = Hierarchy & { workspaces: { id: string }[] };

type OperationalDataCounts = {
  homogeneousGroups: number;
  characterizations: number;
  environments: number;
  riskFactorData: number;
  riskFactorDataRec: number;
  derivedMeasures: number;
  actionPlanRules: number;
  documentData: number;
  riskFactorDocuments: number;
  documents: number;
};

@Injectable()
export class WorkspaceConvertService {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly operationalCloneService: WorkspaceOperationalDataCloneService,
  ) {}

  assertMaster(user: UserPayloadDto) {
    if (!user?.isMaster) {
      throw new ForbiddenException(
        'Apenas usuário master pode executar esta operação',
      );
    }
  }

  async listCompanyGroups(
    companyId: string,
    user: UserPayloadDto,
  ): Promise<WorkspaceConvertCompanyGroupOption[]> {
    this.assertMaster(user);
    return this.operationalCloneService.listCompanyGroupsForSourceCompany(
      companyId,
    );
  }

  async preview(params: {
    companyId: string;
    workspaceId: string;
    companyGroupId: number;
    user: UserPayloadDto;
  }): Promise<WorkspaceConvertPreviewResult> {
    this.assertMaster(params.user);

    const context = await this.loadContext(params);
    const operationalCounts = await this.countOperationalData(
      params.companyId,
      params.workspaceId,
    );

    const warnings: string[] = [
      'Esta operação é delicada e não possui reversão automática.',
      'Os dados operacionais do estabelecimento serão copiados para a nova empresa.',
    ];

    const multiWorkspaceForms = await this.findMultiWorkspaceFormApplications(
      params.companyId,
      params.workspaceId,
    );
    if (multiWorkspaceForms.length > 0) {
      warnings.push(
        `Formulário(s) com múltiplos estabelecimentos (${multiWorkspaceForms.map((f) => f.name).join(', ')}): após esta conversão, a matriz permanece restrita aos estabelecimentos ainda não convertidos; o estabelecimento convertido passa a empresa participante sem ampliar o recorte da matriz.`,
      );
    }

    const formApplications = await this.findAffectedFormApplications(
      params.companyId,
      params.workspaceId,
    );

    const hierarchies = await this.collectWorkspaceHierarchies(
      params.companyId,
      params.workspaceId,
    );

    // Mesmo critério de transferHierarchies (incl. rebaixamento por ponto-fixo): nós exclusivos
    // cujo subárvore também é exclusiva são MOVIDOS (id preservado); o resto é CLONADO.
    const movableHierarchyIds = await this.resolveMovableHierarchies({
      tx: this.prisma,
      sourceWorkspaceId: params.workspaceId,
      hierarchies,
    });
    const hierarchiesMoved = movableHierarchyIds.size;
    const hierarchiesCloned = hierarchies.length - hierarchiesMoved;

    const employees = await this.countWorkspaceEmployees(
      params.companyId,
      params.workspaceId,
    );

    const companyJson = (context.workspace.companyJson || {}) as Record<
      string,
      string | undefined
    >;

    return {
      workspace: {
        id: context.workspace.id,
        name: context.workspace.name,
        cnpj: context.workspace.cnpj,
        isOwner: context.workspace.isOwner,
        abbreviation: context.workspace.abbreviation,
      },
      proposedCompany: {
        name: companyJson.name || context.workspace.name,
        cnpj: context.workspace.cnpj || companyJson.cnpj || null,
        fantasy: companyJson.fantasy || null,
        initials: context.workspace.abbreviation,
      },
      companyGroup: {
        id: context.companyGroup.id,
        name: context.companyGroup.name,
      },
      counts: {
        employees,
        hierarchies: hierarchies.length,
        hierarchiesMoved,
        hierarchiesCloned,
        homogeneousGroups: operationalCounts.homogeneousGroups,
        characterizations: operationalCounts.characterizations,
        environments: operationalCounts.environments,
        riskFactorData: operationalCounts.riskFactorData,
        riskFactorDataRec: operationalCounts.riskFactorDataRec,
        derivedMeasures: operationalCounts.derivedMeasures,
        actionPlanRules: operationalCounts.actionPlanRules,
        documentData: operationalCounts.documentData,
        riskFactorDocuments: operationalCounts.riskFactorDocuments,
        documents: operationalCounts.documents,
        formApplications: formApplications.length,
      },
      affectedFormApplications: formApplications.map((app) => ({
        id: app.id,
        name: app.name,
        scopeType: app.scope_type,
      })),
      blocks: context.blocks,
      warnings,
    };
  }

  async convert(params: {
    companyId: string;
    workspaceId: string;
    companyGroupId: number;
    confirmationText: string;
    user: UserPayloadDto;
  }): Promise<WorkspaceConvertResult> {
    this.assertMaster(params.user);

    const context = await this.loadContext(params);

    if (context.blocks.length > 0) {
      throw new BadRequestException(context.blocks.join(' '));
    }

    this.validateConfirmation(params.confirmationText, context.workspace.name);

    try {
      const result = await this.prisma.$transaction(
        async (tx) => {
          const newCompanyId = uuidV4();
          const newWorkspaceId = uuidV4();
          const companyJson = (context.workspace.companyJson || {}) as Record<
            string,
            string | undefined
          >;

          await tx.company.create({
            data: {
              id: newCompanyId,
              name: companyJson.name || context.workspace.name,
              fantasy: companyJson.fantasy || undefined,
              cnpj: context.workspace.cnpj || companyJson.cnpj || undefined,
              status: StatusEnum.ACTIVE,
              type: CompanyTypesEnum.FILIAL,
              groupId: params.companyGroupId,
              initials: context.workspace.abbreviation || undefined,
              logoUrl: context.workspace.logoUrl || undefined,
              description: context.workspace.description || undefined,
              ...(context.workspace.address
                ? {
                    address: {
                      create: this.buildAddressCreatePayload(
                        context.workspace.address,
                      ),
                    },
                  }
                : {}),
            },
          });

          await tx.workspace.create({
            data: {
              id: newWorkspaceId,
              companyId: newCompanyId,
              name: context.workspace.name,
              abbreviation: context.workspace.abbreviation,
              description: context.workspace.description,
              cnpj: context.workspace.cnpj,
              companyJson: context.workspace.companyJson ?? undefined,
              logoUrl: context.workspace.logoUrl,
              isOwner: true,
              status: StatusEnum.ACTIVE,
              ...(context.workspace.address
                ? {
                    address: {
                      create: this.buildAddressCreatePayload(
                        context.workspace.address,
                      ),
                    },
                  }
                : {}),
            },
          });

          // A nova empresa herda as consultorias (applyService) da empresa de origem.
          const inheritedConsultancyContractsCount =
            await this.inheritConsultancyContracts({
              tx,
              sourceCompanyId: params.companyId,
              newCompanyId,
            });

          const sourceHierarchies = await this.collectWorkspaceHierarchies(
            params.companyId,
            params.workspaceId,
            tx,
          );

          const { hierarchyMap, movedHierarchyIds } =
            await this.transferHierarchies({
              tx,
              sourceCompanyId: params.companyId,
              sourceWorkspaceId: params.workspaceId,
              targetCompanyId: newCompanyId,
              targetWorkspaceId: newWorkspaceId,
              hierarchies: sourceHierarchies,
            });

          const operationalClone = await this.operationalCloneService.execute({
            tx,
            sourceCompanyId: params.companyId,
            sourceWorkspaceId: params.workspaceId,
            targetCompanyId: newCompanyId,
            targetWorkspaceId: newWorkspaceId,
            hierarchyMap,
            movedHierarchyIds,
          });

          const migratedEmployeesCount = await this.migrateEmployees({
            tx,
            sourceCompanyId: params.companyId,
            sourceWorkspaceId: params.workspaceId,
            targetCompanyId: newCompanyId,
            hierarchyMap,
          });

          const convertedFormApplicationsCount =
            await this.convertFormApplications({
              tx,
              sourceCompanyId: params.companyId,
              sourceWorkspaceId: params.workspaceId,
              newCompanyId,
              companyGroupId: params.companyGroupId,
              hierarchyMap,
            });

          // Só agora (depois que empregados/formulários leram o recorte pelo vínculo de
          // origem) removemos o workspace de origem das hierarquias movidas/clonadas.
          await this.detachSourceWorkspaceFromHierarchies({
            tx,
            sourceCompanyId: params.companyId,
            sourceWorkspaceId: params.workspaceId,
            hierarchyIds: sourceHierarchies.map((hierarchy) => hierarchy.id),
          });

          await tx.workspace.update({
            where: { id: params.workspaceId },
            data: { deleted_at: new Date() },
          });

          const summary = {
            migratedEmployeesCount,
            migratedHierarchiesCount: hierarchyMap.size,
            copiedRiskDataCount: operationalClone.counts.riskFactorData,
            convertedFormApplicationsCount,
            inheritedConsultancyContractsCount,
            operational: operationalClone.counts,
            warnings: operationalClone.warnings,
          };

          await tx.workspaceToCompanyConversionLog.create({
            data: {
              status: 'SUCCESS',
              executed_by_user_id: this.resolveExecutorUserId(params.user),
              source_company_id: params.companyId,
              source_workspace_id: params.workspaceId,
              target_company_id: newCompanyId,
              target_workspace_id: newWorkspaceId,
              company_group_id: params.companyGroupId,
              summary,
            },
          });

          return {
            newCompanyId,
            newWorkspaceId,
            migratedEmployeesCount,
            migratedHierarchiesCount: hierarchyMap.size,
            copiedRiskDataCount: operationalClone.counts.riskFactorData,
            convertedFormApplicationsCount,
            operational: operationalClone.counts,
            warnings: operationalClone.warnings,
          };
        },
        { maxWait: 10000, timeout: 300000 },
      );

      return result;
    } catch (error) {
      await this.logConversionFailure(params, error);
      throw this.toConversionHttpError(error);
    }
  }

  /** Mesmo padrão de WorkspaceRepository: Prisma preenche id/companyId via relação composta. */
  private buildAddressCreatePayload(address: Address) {
    return {
      cep: address.cep,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    };
  }

  private resolveExecutorUserId(user: UserPayloadDto): number {
    if (Number.isFinite(user?.userId)) {
      return user.userId;
    }

    const nestedUser = user as UserPayloadDto & {
      user?: { id?: number };
      id?: number;
    };

    if (Number.isFinite(nestedUser.user?.id)) {
      return nestedUser.user!.id!;
    }

    if (Number.isFinite(nestedUser.id)) {
      return nestedUser.id!;
    }

    throw new BadRequestException(
      'Usuário executor não identificado para auditoria da conversão',
    );
  }

  private async logConversionFailure(
    params: {
      companyId: string;
      workspaceId: string;
      companyGroupId: number;
      user: UserPayloadDto;
    },
    error: unknown,
  ) {
    try {
      await this.prisma.workspaceToCompanyConversionLog.create({
        data: {
          status: 'FAILED',
          executed_by_user_id: this.resolveExecutorUserId(params.user),
          source_company_id: params.companyId,
          source_workspace_id: params.workspaceId,
          company_group_id: params.companyGroupId,
          error_message:
            error instanceof Error ? error.message : 'Erro desconhecido',
        },
      });
    } catch (logError) {
      // Não mascarar o erro original da conversão.
      console.error(
        'Falha ao registrar WorkspaceToCompanyConversionLog:',
        logError,
      );
    }
  }

  private toConversionHttpError(error: unknown): Error {
    if (error instanceof BadRequestException) {
      return error;
    }

    if (error instanceof PrismaClientValidationError) {
      const detail =
        error.message.split('\n').find((line) => line.trim().startsWith('Unknown argument')) ??
        error.message.split('\n').pop()?.trim() ??
        error.message;

      return new BadRequestException(
        `Falha na conversão por dados inválidos: ${detail}`,
      );
    }

    if (error instanceof Error) {
      return error;
    }

    return new BadRequestException('Erro desconhecido na conversão');
  }

  private validateConfirmation(confirmationText: string, workspaceName: string) {
    const normalized = confirmationText?.trim().toUpperCase();
    const expectedName = workspaceName.trim().toUpperCase();
    if (normalized !== CONFIRMATION_TOKEN && normalized !== expectedName) {
      throw new BadRequestException(
        `Confirmação inválida. Digite "${CONFIRMATION_TOKEN}" ou o nome do estabelecimento.`,
      );
    }
  }

  private async loadContext(params: {
    companyId: string;
    workspaceId: string;
    companyGroupId: number;
  }) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: params.workspaceId,
        companyId: params.companyId,
        deleted_at: null,
      },
      include: { address: true },
    });

    if (!workspace) {
      throw new NotFoundException('Estabelecimento não encontrado');
    }

    const companyGroup = await this.prisma.companyGroup.findFirst({
      where: {
        id: params.companyGroupId,
        OR: [
          { companyId: params.companyId },
          { companies: { some: { id: params.companyId } } },
        ],
      },
      select: { id: true, name: true },
    });

    const blocks: string[] = [];

    if (!companyGroup) {
      blocks.push(
        'Grupo empresarial inválido ou a empresa de origem não pertence a este grupo.',
      );
    }

    const activeWorkspacesCount = await this.prisma.workspace.count({
      where: { companyId: params.companyId, deleted_at: null },
    });

    if (workspace.isOwner && activeWorkspacesCount <= 1) {
      blocks.push(
        'Não é possível converter o estabelecimento principal único da empresa.',
      );
    }

    const cnpj = workspace.cnpj;
    if (cnpj) {
      const duplicate = await this.prisma.company.findFirst({
        where: {
          cnpj,
          id: { not: params.companyId },
          deleted_at: null,
        },
        select: { id: true, name: true },
      });
      if (duplicate) {
        blocks.push(
          `Já existe outra empresa com o CNPJ ${cnpj} (${duplicate.name}).`,
        );
      }
    }

    const pendingLog = await this.prisma.workspaceToCompanyConversionLog.findFirst({
      where: {
        source_workspace_id: params.workspaceId,
        status: 'SUCCESS',
      },
    });
    if (pendingLog?.target_company_id) {
      blocks.push('Este estabelecimento já foi convertido em empresa.');
    }

    return {
      workspace,
      companyGroup: companyGroup || { id: params.companyGroupId, name: '' },
      blocks,
    };
  }

  private workspaceRiskDataWhere(
    companyId: string,
    workspaceId: string,
  ): Prisma.RiskFactorDataWhereInput {
    return {
      companyId,
      deletedAt: null,
      OR: [
        {
          homogeneousGroup: {
            deletedAt: null,
            workspaces: { some: { id: workspaceId } },
          },
        },
        {
          hierarchy: {
            deletedAt: null,
            workspaces: { some: { id: workspaceId } },
          },
        },
      ],
    };
  }

  private async countOperationalData(
    companyId: string,
    workspaceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<OperationalDataCounts> {
    const workspaceHomogeneousFilter = {
      companyId,
      deletedAt: null,
      workspaces: { some: { id: workspaceId } },
    };

    const [
      homogeneousGroups,
      characterizations,
      environments,
      riskFactorData,
      riskFactorDataRec,
      derivedMeasures,
      actionPlanRules,
      documentData,
      riskFactorDocuments,
      documents,
    ] = await Promise.all([
      tx.homogeneousGroup.count({ where: workspaceHomogeneousFilter }),
      tx.companyCharacterization.count({
        where: {
          companyId,
          workspaceId,
          deleted_at: null,
        },
      }),
      tx.companyEnvironment.count({
        where: {
          companyId,
          workspaceId,
          deleted_at: null,
        },
      }),
      tx.riskFactorData.count({
        where: this.workspaceRiskDataWhere(companyId, workspaceId),
      }),
      this.operationalCloneService.countRiskFactorDataRecForPreview(
        companyId,
        workspaceId,
        tx,
      ),
      this.operationalCloneService.countDerivedMeasuresForPreview(
        companyId,
        workspaceId,
        tx,
      ),
      tx.actionPlanRules.count({
        where: {
          workspace_id: workspaceId,
          deleted_at: null,
        },
      }),
      tx.documentData.count({
        where: {
          companyId,
          workspaceId,
        },
      }),
      tx.riskFactorDocument.count({
        where: {
          companyId,
          workspaceId,
        },
      }),
      tx.document.count({
        where: {
          companyId,
          workspaceId,
        },
      }),
    ]);

    return {
      homogeneousGroups,
      characterizations,
      environments,
      riskFactorData,
      riskFactorDataRec,
      derivedMeasures,
      actionPlanRules,
      documentData,
      riskFactorDocuments,
      documents,
    };
  }

  private async countWorkspaceEmployees(companyId: string, workspaceId: string) {
    return this.prisma.employee.count({
      where: {
        companyId,
        deleted_at: null,
        hierarchy: {
          workspaces: { some: { id: workspaceId } },
        },
      },
    });
  }

  private async collectWorkspaceHierarchies(
    companyId: string,
    workspaceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<HierarchyWithWorkspaces[]> {
    // Apenas vínculos de workspace ATIVOS contam para decidir mover×clonar.
    const activeWorkspaces = { where: { deleted_at: null }, select: { id: true } } as const;

    const direct = await tx.hierarchy.findMany({
      where: {
        companyId,
        deletedAt: null,
        workspaces: { some: { id: workspaceId } },
      },
      include: { workspaces: activeWorkspaces },
    });

    const byId = new Map<string, HierarchyWithWorkspaces>();
    const addWithAncestors = async (hierarchy: HierarchyWithWorkspaces) => {
      if (byId.has(hierarchy.id)) return;
      if (hierarchy.parentId) {
        const parent = await tx.hierarchy.findFirst({
          where: { id: hierarchy.parentId, companyId },
          include: { workspaces: activeWorkspaces },
        });
        if (parent) await addWithAncestors(parent as HierarchyWithWorkspaces);
      }
      byId.set(hierarchy.id, hierarchy);
    };

    for (const hierarchy of direct) {
      await addWithAncestors(hierarchy as HierarchyWithWorkspaces);
    }

    return [...byId.values()];
  }

  /**
   * Decide quais nós podem ser MOVIDOS (id preservado) vs CLONADOS.
   * Regra: um nó só pode ser movido se NÃO tem vínculo de workspace ativo fora da origem
   * E TODOS os seus filhos ativos também forem movidos. Se algum filho permanece na origem
   * (compartilhado, fora do recorte, ou rebaixado), mover o pai deixaria esse filho com
   * parentId apontando para outra empresa (órfão na origem) — então o pai é rebaixado para clonar.
   * A propagação é feita por ponto-fixo de baixo para cima.
   */
  private async resolveMovableHierarchies(params: {
    tx: Prisma.TransactionClient;
    sourceWorkspaceId: string;
    hierarchies: HierarchyWithWorkspaces[];
  }): Promise<Set<string>> {
    const moveSet = new Set<string>(
      params.hierarchies
        .filter(
          (hierarchy) =>
            !hierarchy.workspaces.some((w) => w.id !== params.sourceWorkspaceId),
        )
        .map((hierarchy) => hierarchy.id),
    );

    if (moveSet.size === 0) return moveSet;

    // Filhos ATIVOS de qualquer nó do recorte (inclusive filhos fora do recorte).
    const cutIds = params.hierarchies.map((hierarchy) => hierarchy.id);
    const activeChildren = await params.tx.hierarchy.findMany({
      where: { parentId: { in: cutIds }, deletedAt: null },
      select: { id: true, parentId: true },
    });
    const childrenByParent = new Map<string, string[]>();
    for (const child of activeChildren) {
      if (!child.parentId) continue;
      const list = childrenByParent.get(child.parentId) ?? [];
      list.push(child.id);
      childrenByParent.set(child.parentId, list);
    }

    let changed = true;
    while (changed) {
      changed = false;
      for (const id of [...moveSet]) {
        const children = childrenByParent.get(id) ?? [];
        if (children.some((childId) => !moveSet.has(childId))) {
          moveSet.delete(id);
          changed = true;
        }
      }
    }

    return moveSet;
  }

  /**
   * Híbrido mover×clonar para a hierarquia do estabelecimento:
   * - Nó EXCLUSIVO do workspace de origem → MOVER no lugar (preserva o id; só muda companyId/parentId
   *   e conecta o workspace alvo).
   * - Nó COMPARTILHADO com outros workspaces ativos → CLONAR (id novo); o original permanece na origem.
   *
   * NÃO desconecta/soft-deleta o vínculo de origem aqui. Isso é feito em
   * detachSourceWorkspaceFromHierarchies, só depois que empregados/formulários já leram o recorte
   * (que é localizado por `hierarchy.workspaces.some(id === sourceWorkspaceId)`).
   */
  private async transferHierarchies(params: {
    tx: Prisma.TransactionClient;
    sourceCompanyId: string;
    sourceWorkspaceId: string;
    targetCompanyId: string;
    targetWorkspaceId: string;
    hierarchies: HierarchyWithWorkspaces[];
  }): Promise<{
    hierarchyMap: Map<string, string>;
    movedHierarchyIds: Set<string>;
  }> {
    const hierarchyMap = new Map<string, string>();
    const movedHierarchyIds = new Set<string>();
    const sorted = this.sortHierarchiesForClone(params.hierarchies);

    const moveSet = await this.resolveMovableHierarchies(params);

    const targetWorkspaceConnect = {
      id_companyId: {
        id: params.targetWorkspaceId,
        companyId: params.targetCompanyId,
      },
    };

    for (const hierarchy of sorted) {
      const mappedParentId = hierarchy.parentId
        ? hierarchyMap.get(hierarchy.parentId)
        : undefined;

      if (moveSet.has(hierarchy.id)) {
        // MOVER no lugar (preserva o id).
        await params.tx.hierarchy.update({
          where: { id: hierarchy.id },
          data: {
            companyId: params.targetCompanyId,
            parentId: mappedParentId ?? null,
            workspaces: { connect: targetWorkspaceConnect },
          },
        });
        hierarchyMap.set(hierarchy.id, hierarchy.id);
        movedHierarchyIds.add(hierarchy.id);
      } else {
        // CLONAR (compartilhado): id novo no alvo; o original segue para os demais workspaces.
        const newId = uuidV4();
        await params.tx.hierarchy.create({
          data: {
            id: newId,
            companyId: params.targetCompanyId,
            name: hierarchy.name,
            type: hierarchy.type,
            description: hierarchy.description,
            realDescription: hierarchy.realDescription,
            refName: hierarchy.refName,
            metadata: hierarchy.metadata ?? undefined,
            parentId: mappedParentId,
            workspaces: { connect: targetWorkspaceConnect },
          },
        });
        hierarchyMap.set(hierarchy.id, newId);
      }
    }

    return { hierarchyMap, movedHierarchyIds };
  }

  /**
   * Etapa final: remove o vínculo do workspace de ORIGEM de todos os nós do recorte.
   * - Nós movidos ficam apenas com o workspace alvo.
   * - Nós clonados (compartilhados) mantêm os demais workspaces da origem.
   * Roda só depois de migrar empregados/formulários (que leem o recorte pelo vínculo de origem).
   */
  private async detachSourceWorkspaceFromHierarchies(params: {
    tx: Prisma.TransactionClient;
    sourceCompanyId: string;
    sourceWorkspaceId: string;
    hierarchyIds: string[];
  }) {
    for (const hierarchyId of params.hierarchyIds) {
      await params.tx.hierarchy.update({
        where: { id: hierarchyId },
        data: {
          workspaces: {
            disconnect: {
              id_companyId: {
                id: params.sourceWorkspaceId,
                companyId: params.sourceCompanyId,
              },
            },
          },
        },
      });
    }
  }

  /**
   * A nova empresa herda as consultorias da empresa de origem: para cada contrato em que a
   * origem é a empresa que RECEBE serviço (receivingService), recriamos o mesmo vínculo apontando
   * a nova empresa como receivingService — mantendo a mesma consultoria (applyService) e o status.
   * Assim a nova empresa continua acessível/atendida pelas mesmas consultorias (permissões, forms,
   * eSocial, etc., que navegam por Contract).
   */
  private async inheritConsultancyContracts(params: {
    tx: Prisma.TransactionClient;
    sourceCompanyId: string;
    newCompanyId: string;
  }): Promise<number> {
    const consultancyContracts = await params.tx.contract.findMany({
      where: { receivingServiceCompanyId: params.sourceCompanyId },
      select: { applyingServiceCompanyId: true, status: true },
    });

    if (consultancyContracts.length === 0) return 0;

    await params.tx.contract.createMany({
      data: consultancyContracts.map((contract) => ({
        applyingServiceCompanyId: contract.applyingServiceCompanyId,
        receivingServiceCompanyId: params.newCompanyId,
        status: contract.status,
      })),
      skipDuplicates: true,
    });

    return consultancyContracts.length;
  }

  private sortHierarchiesForClone<T extends Hierarchy>(hierarchies: T[]): T[] {
    const byId = new Map(hierarchies.map((h) => [h.id, h]));
    const sorted: T[] = [];
    const added = new Set<string>();

    const visit = (hierarchy: T) => {
      if (
        hierarchy.parentId &&
        byId.has(hierarchy.parentId) &&
        !added.has(hierarchy.parentId)
      ) {
        visit(byId.get(hierarchy.parentId)!);
      }
      if (!added.has(hierarchy.id)) {
        sorted.push(hierarchy);
        added.add(hierarchy.id);
      }
    };

    hierarchies.forEach(visit);
    return sorted;
  }

  private async migrateEmployees(params: {
    tx: Prisma.TransactionClient;
    sourceCompanyId: string;
    sourceWorkspaceId: string;
    targetCompanyId: string;
    hierarchyMap: Map<string, string>;
  }) {
    const employees = await params.tx.employee.findMany({
      where: {
        companyId: params.sourceCompanyId,
        deleted_at: null,
        hierarchy: {
          workspaces: { some: { id: params.sourceWorkspaceId } },
        },
      },
      select: { id: true, hierarchyId: true },
    });

    for (const employee of employees) {
      const mappedHierarchyId = employee.hierarchyId
        ? params.hierarchyMap.get(employee.hierarchyId)
        : undefined;

      if (employee.hierarchyId && !mappedHierarchyId) {
        throw new BadRequestException(
          `Não foi possível mapear hierarquia do empregado ${employee.id}`,
        );
      }

      await params.tx.employee.update({
        where: { id: employee.id },
        data: {
          companyId: params.targetCompanyId,
          hierarchyId: mappedHierarchyId,
        },
      });
    }

    return employees.length;
  }

  private async findAffectedFormApplications(
    companyId: string,
    workspaceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    return tx.formApplication.findMany({
      where: {
        deleted_at: null,
        participants: {
          workspaces: { some: { workspace_id: workspaceId } },
        },
        OR: [
          { company_id: companyId },
          {
            applicationCompanies: { some: { company_id: companyId } },
          },
        ],
      },
      select: { id: true, name: true, scope_type: true, company_id: true },
    });
  }

  private async findMultiWorkspaceFormApplications(
    companyId: string,
    workspaceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const apps = await this.findAffectedFormApplications(
      companyId,
      workspaceId,
      tx,
    );

    const result: { id: string; name: string; workspaceCount: number }[] = [];

    for (const app of apps) {
      if (app.scope_type !== FormApplicationScopeTypeEnum.COMPANY_WORKSPACES) {
        continue;
      }

      const count = await tx.formParticipantsWorkspace.count({
        where: {
          form_participants: { form_application_id: app.id },
        },
      });

      if (count > 1) {
        result.push({ id: app.id, name: app.name, workspaceCount: count });
      }
    }

    return result;
  }

  private async convertFormApplications(params: {
    tx: Prisma.TransactionClient;
    sourceCompanyId: string;
    sourceWorkspaceId: string;
    newCompanyId: string;
    companyGroupId: number;
    hierarchyMap: Map<string, string>;
  }) {
    const applications = await this.findAffectedFormApplications(
      params.sourceCompanyId,
      params.sourceWorkspaceId,
      params.tx,
    );

    for (const application of applications) {
      const full = await params.tx.formApplication.findFirst({
        where: { id: application.id },
        include: {
          participants: {
            include: { workspaces: true, hierarchies: true },
          },
          applicationCompanies: true,
        },
      });

      if (!full?.participants) continue;

      const remainingWorkspaces = full.participants.workspaces.filter(
        (workspace) => workspace.workspace_id !== params.sourceWorkspaceId,
      );

      const alreadyLinked = full.applicationCompanies.some(
        (row) => row.company_id === params.newCompanyId,
      );

      if (!alreadyLinked) {
        await params.tx.formApplicationCompany.create({
          data: {
            form_application_id: full.id,
            company_id: params.newCompanyId,
          },
        });
      }

      await params.tx.formParticipantsWorkspace.deleteMany({
        where: {
          form_participants_id: full.participants.id,
          workspace_id: params.sourceWorkspaceId,
        },
      });

      const shouldPromote =
        await this.shouldPromoteFormApplicationToBusinessGroup({
          tx: params.tx,
          anchorCompanyId: full.company_id,
          remainingParticipantWorkspaceIds: remainingWorkspaces.map(
            (workspace) => workspace.workspace_id,
          ),
        });

      if (shouldPromote) {
        await this.promoteFormApplicationToBusinessGroup({
          tx: params.tx,
          formApplicationId: full.id,
          formParticipantsId: full.participants.id,
          anchorCompanyId: full.company_id,
          companyGroupId: params.companyGroupId,
          participantCompanyIds: [
            ...new Set([
              full.company_id,
              ...full.applicationCompanies.map((row) => row.company_id),
              params.newCompanyId,
            ]),
          ],
        });
      }

      for (const participantHierarchy of full.participants.hierarchies) {
        const mappedId = params.hierarchyMap.get(
          participantHierarchy.hierarchy_id,
        );
        if (mappedId) {
          await params.tx.formParticipantsHierarchy.update({
            where: { id: participantHierarchy.id },
            data: { hierarchy_id: mappedId },
          });
        }
      }

      const hierarchyGroupItems =
        await params.tx.formApplicationHierarchyGroupItem.findMany({
          where: {
            group: { form_application_id: full.id },
          },
        });

      for (const item of hierarchyGroupItems) {
        const mappedId = params.hierarchyMap.get(item.hierarchy_id);
        if (mappedId) {
          await params.tx.formApplicationHierarchyGroupItem.update({
            where: { id: item.id },
            data: { hierarchy_id: mappedId },
          });
        }
      }

      const aiAnalyses = await params.tx.formAiAnalysis.findMany({
        where: {
          formApplicationId: full.id,
          hierarchyId: { in: [...params.hierarchyMap.keys()] },
        },
      });

      for (const analysis of aiAnalyses) {
        const mappedHierarchyId = params.hierarchyMap.get(analysis.hierarchyId);
        if (mappedHierarchyId) {
          await params.tx.formAiAnalysis.update({
            where: { id: analysis.id },
            data: {
              companyId: params.newCompanyId,
              hierarchyId: mappedHierarchyId,
            },
          });
        }
      }
    }

    return applications.length;
  }

  /**
   * Promove para BUSINESS_GROUP_COMPANIES quando não restam filiais no participante:
   * - nenhum workspace, ou
   * - apenas workspace(s) owner/principal da matriz âncora (ex.: PSH, não convertível).
   */
  private async shouldPromoteFormApplicationToBusinessGroup(params: {
    tx: Prisma.TransactionClient;
    anchorCompanyId: string;
    remainingParticipantWorkspaceIds: string[];
  }): Promise<boolean> {
    if (params.remainingParticipantWorkspaceIds.length === 0) {
      return true;
    }

    const anchorOwnerWorkspaces = await params.tx.workspace.findMany({
      where: {
        id: { in: params.remainingParticipantWorkspaceIds },
        companyId: params.anchorCompanyId,
        isOwner: true,
        deleted_at: null,
      },
      select: { id: true },
    });

    return (
      anchorOwnerWorkspaces.length ===
      params.remainingParticipantWorkspaceIds.length
    );
  }

  private async promoteFormApplicationToBusinessGroup(params: {
    tx: Prisma.TransactionClient;
    formApplicationId: string;
    formParticipantsId: string;
    anchorCompanyId: string;
    companyGroupId: number;
    participantCompanyIds: string[];
  }) {
    const participantCompanyIds = [
      ...new Set(params.participantCompanyIds),
    ];

    if (!participantCompanyIds.includes(params.anchorCompanyId)) {
      throw new BadRequestException(
        `Promoção do formulário ${params.formApplicationId}: matriz âncora deve constar em FormApplicationCompany`,
      );
    }

    await params.tx.formParticipantsWorkspace.deleteMany({
      where: { form_participants_id: params.formParticipantsId },
    });

    await params.tx.formApplication.update({
      where: { id: params.formApplicationId },
      data: {
        scope_type: FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES,
        company_group_id: params.companyGroupId,
        applicationCompanies: {
          deleteMany: {},
          create: participantCompanyIds.map((company_id) => ({
            company_id,
          })),
        },
      },
    });
  }

  /**
   * Repara formulários híbridos já convertidos (ex.: Petralco) que ficaram com scope
   * COMPANY_WORKSPACES e apenas o workspace owner da matriz em FormParticipantsWorkspace.
   */
  async repairHybridFormApplicationsAfterBranchConversions(params: {
    anchorCompanyId: string;
    companyGroupId: number;
    user: UserPayloadDto;
  }): Promise<{ repairedApplicationIds: string[] }> {
    this.assertMaster(params.user);

    const companyGroup = await this.prisma.companyGroup.findFirst({
      where: {
        id: params.companyGroupId,
        companies: { some: { id: params.anchorCompanyId } },
      },
    });
    if (!companyGroup) {
      throw new BadRequestException(
        'Grupo empresarial inválido ou a empresa âncora não pertence a este grupo.',
      );
    }

    const applications = await this.prisma.formApplication.findMany({
      where: {
        deleted_at: null,
        company_id: params.anchorCompanyId,
        scope_type: FormApplicationScopeTypeEnum.COMPANY_WORKSPACES,
        applicationCompanies: { some: {} },
        participants: { isNot: null },
      },
      include: {
        participants: { include: { workspaces: true } },
        applicationCompanies: true,
      },
    });

    const repairedApplicationIds: string[] = [];

    for (const application of applications) {
      if (!application.participants) continue;

      const remainingIds = application.participants.workspaces.map(
        (workspace) => workspace.workspace_id,
      );

      const shouldPromote =
        await this.shouldPromoteFormApplicationToBusinessGroup({
          tx: this.prisma,
          anchorCompanyId: params.anchorCompanyId,
          remainingParticipantWorkspaceIds: remainingIds,
        });

      if (!shouldPromote) continue;

      const participantCompanyIds = [
        ...new Set([
          application.company_id,
          ...application.applicationCompanies.map((row) => row.company_id),
        ]),
      ];

      await this.prisma.$transaction(async (tx) => {
        await this.promoteFormApplicationToBusinessGroup({
          tx,
          formApplicationId: application.id,
          formParticipantsId: application.participants!.id,
          anchorCompanyId: application.company_id,
          companyGroupId: params.companyGroupId,
          participantCompanyIds,
        });
      });

      repairedApplicationIds.push(application.id);
    }

    return { repairedApplicationIds };
  }
}

