import { BadRequestException, Injectable } from '@nestjs/common';
import { FormApplicationDAO } from '../../../../database/dao/form-application/form-application.dao';
import { IPublicFormApplicationUseCase } from './public-form-application.types';
import { FormIdentifierTypeEnum } from '@prisma/client';
import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';
import { FormParticipantsAnswersAggregateRepository } from '@/@v2/forms/database/repositories/form-participants-answers/form-participants-answers-aggregate.repository';

@Injectable()
export class PublicFormApplicationUseCase {
  constructor(
    private readonly formApplicationDAO: FormApplicationDAO,
    private readonly formApplicationRepository: FormApplicationAggregateRepository,
    private readonly formParticipantsAnswersAggregateRepository: FormParticipantsAnswersAggregateRepository,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute(params: IPublicFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationRepository.find({
      id: params.applicationId,
      companyId: undefined,
    });

    if (!formApplication) {
      throw new BadRequestException('Formulário não encontrado');
    }

    if (!formApplication.formApplication.canBeAnswered()) {
      return {
        data: null,
        isPublic: false,
        isTesting: false,
      };
    }

    let hierarchyId: string | undefined;
    // Validate if form is shareable - if not, employeeId is required
    // Exception: when form is in testing mode, allow access without employeeId
    if (!formApplication.isShareableLink && !formApplication.formApplication.isTesting) {
      if (!params.employeeId) {
        return {
          data: null,
          isPublic: false,
          isTesting: false,
        };
      }

      const validate = await this.validateEmployeeEligibility(params.employeeId, formApplication);
      hierarchyId = validate.hierarchyId;
    }

    // Check if user has already answered this form
    let hasAlreadyAnswered = false;
    if (params.employeeId) {
      const existingAnswer = await this.formParticipantsAnswersAggregateRepository.findByEmployeeAndFormApplication({
        formApplicationId: params.applicationId,
        employeeId: params.employeeId,
        companyId: formApplication.formApplication.companyId,
      });
      hasAlreadyAnswered = !!existingAnswer;
    }

    const formApplicationData = await this.formApplicationDAO.readPublic({
      id: params.applicationId,
    });

    if (!formApplicationData) {
      throw new BadRequestException('Formulário não encontrado');
    }

    return {
      data: formApplicationData,
      options: {
        hierarchies: await this.getHierarchies(formApplication),
      },
      hierarchyId: hierarchyId,
      employeeId: params.employeeId,
      hasAlreadyAnswered: hasAlreadyAnswered,
      isPublic: formApplication.formApplication.isPublic,
      isTesting: formApplication.formApplication.isTesting,
    };
  }

  private async getHierarchies(formApplication: FormApplicationAggregate) {
    if (!formApplication.isAskingHierarchy) {
      return [];
    }

    const allowedCompanyIds = this.getAllowedCompanyIds(formApplication);

    const hierarchies = await this.prisma.hierarchy.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true,
      },
      where: {
        workspaces: {
          some: {
            id: {
              in: formApplication.participantsWorkspaces.map((workspace) => workspace.workspaceId),
            },
          },
        },
        companyId: {
          in: allowedCompanyIds,
        },
        deletedAt: null,
        status: 'ACTIVE',
        type: {
          in: [FormIdentifierTypeEnum.DIRECTORY, FormIdentifierTypeEnum.MANAGEMENT, FormIdentifierTypeEnum.SUB_SECTOR, FormIdentifierTypeEnum.SECTOR],
        },
      },
    });

    return hierarchies;
  }

  private async validateEmployeeEligibility(employeeId: number, formApplication: FormApplicationAggregate) {
    // Build list of allowed company IDs based on form application scope
    const allowedCompanyIds = this.getAllowedCompanyIds(formApplication);

    // Check if employee exists and is active in any of the allowed companies
    const employee = await this.prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId: {
          in: allowedCompanyIds,
        },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        companyId: true,
        hierarchy: {
          select: {
            id: true,
            type: true,
            parent: {
              select: {
                id: true,
                type: true,
                parent: {
                  select: {
                    id: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!employee?.hierarchy) {
      throw new BadRequestException('Funcionário não encontrado ou inativo');
    }

    // Get SECTOR from hierarchy chain
    const sector = employee.hierarchy.parent?.type == 'SECTOR' ? employee.hierarchy?.parent : employee.hierarchy.parent?.parent;

    if (!sector?.id) {
      throw new BadRequestException('Setor do funcionário não encontrado');
    }

    return { hierarchyId: sector.id };
  }

  /**
   * Returns list of company IDs that are allowed to participate in this form application
   * based on the scope type (single company workspaces or business group companies)
   */
  private getAllowedCompanyIds(formApplication: FormApplicationAggregate): string[] {
    // If it's a business group scope, include all companies in the application
    if (formApplication.applicationCompanies.length > 0) {
      return formApplication.applicationCompanies.map((ac) => ac.companyId);
    }

    // Otherwise, just the main company
    return [formApplication.formApplication.companyId];
  }
}
