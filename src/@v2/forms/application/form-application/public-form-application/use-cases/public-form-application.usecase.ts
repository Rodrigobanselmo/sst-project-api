import { BadRequestException, Injectable } from '@nestjs/common';
import { FormApplicationDAO } from '../../../../database/dao/form-application/form-application.dao';
import { IPublicFormApplicationUseCase } from './public-form-application.types';
import { FormIdentifierTypeEnum } from '@prisma/client';
import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';

@Injectable()
export class PublicFormApplicationUseCase {
  constructor(
    private readonly formApplicationDAO: FormApplicationDAO,
    private readonly formApplicationRepository: FormApplicationAggregateRepository,
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

    // Validate if form is shareable - if not, employeeId is required
    if (!formApplication.isShareableLink) {
      if (!params.employeeId) {
        throw new BadRequestException('Este formulário requer identificação do funcionário');
      }

      await this.validateEmployeeEligibility(params.employeeId, formApplication);
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
      isPublic: formApplication.formApplication.isPublic,
      isTesting: formApplication.formApplication.isTesting,
    };
  }

  private async getHierarchies(formApplication: FormApplicationAggregate) {
    if (!formApplication.isAskingHierarchy) {
      return [];
    }

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
        companyId: formApplication.formApplication.companyId,
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
    // Check if employee exists and is active
    const employee = await this.prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId: formApplication.formApplication.companyId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
      },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado ou inativo');
    }

    //TODO Validate if employee exists and is eligible for this form
  }
}
