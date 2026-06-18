import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from '../../../../..//modules/company/dto/company.dto';
import { WorkspaceDto } from '../../../../../modules/company/dto/workspace.dto';
import { WorkspaceEntity } from '../../../entities/workspace.entity';
import { WorkspaceRepository } from '../../../../../modules/company/repositories/implementations/WorkspaceRepository';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class UpdateCompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async execute(updateCompanyDto: UpdateCompanyDto) {
    let workspace = updateCompanyDto.workspace;

    if (workspace?.length) {
      const workspacesForAbbreviation = await this.workspaceRepository.findAllByCompanyForAbbreviation(
        updateCompanyDto.companyId,
      );

      workspace = workspace.map((item) => {
        if (item.id) {
          const { abbreviation: _abbreviation, ...withoutAbbreviation } = item;
          return withoutAbbreviation as WorkspaceDto;
        }

        const abbreviation = this.resolveUniqueAbbreviation(item, workspacesForAbbreviation);
        return { ...item, abbreviation };
      });
    }

    const company = await this.companyRepository.update(
      { ...updateCompanyDto, workspace },
      {
        include: {
          license: true,
          workspace: true,
          primary_activity: true,
          users: true,
          secondary_activity: true,
        },
      },
    );

    return company;
  }

  private resolveUniqueAbbreviation(
    workspace: WorkspaceDto,
    existingWorkspaces: Pick<WorkspaceEntity, 'id' | 'abbreviation'>[],
  ): string {
    const loop = (abr: string, count = 0): string => {
      const found = existingWorkspaces.find((w) => w.abbreviation === abr);

      if (!found) {
        return abr;
      }

      return loop(abr.split('-')[0] + (count ? '-' + String(count) : ''), count + 1);
    };

    let abr = workspace.name
      .replace(/[^0-9a-zA-Z\s]/g, '')
      .split(' ')
      .slice(0, 2)
      .map((el) => el[0])
      .join('');

    const abrWorkspace = abr.length > 1 ? abr : abr + workspace.name.slice(1, 2).toUpperCase();

    return loop(abrWorkspace);
  }
}
