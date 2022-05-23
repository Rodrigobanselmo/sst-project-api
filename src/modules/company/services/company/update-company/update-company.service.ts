import { Injectable } from '@nestjs/common';
import { WorkspaceDto } from 'src/modules/company/dto/workspace.dto';
import { WorkspaceRepository } from 'src/modules/company/repositories/implementations/WorkspaceRepository';
import { UpdateCompanyDto } from '../../../dto/update-company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class UpdateCompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async execute(updateCompanyDto: UpdateCompanyDto) {
    console.log(updateCompanyDto);
    const newWorkspaces = [] as WorkspaceDto[];

    if (updateCompanyDto.workspace && updateCompanyDto.workspace.length > 0) {
      const workspaces = await this.workspaceRepository.findByCompany(
        updateCompanyDto.companyId,
      );

      updateCompanyDto.workspace.forEach(async (workspace) => {
        const loop = (abr: string, count = 0) => {
          const found = workspaces.find(
            (w) => w.abbreviation === abr && w.id !== workspace.id,
          );

          if (!found) {
            return abr;
          }

          return loop(
            abr.split('-')[0] + (count ? '-' + String(count) : ''),
            count + 1,
          );
        };

        let abr = workspace.name
          .replace(/[^0-9a-zA-Z\s]/g, '')
          .split(' ')
          .slice(0, 2)
          .map((el) => el[0])
          .join('');

        const abrWorkspace =
          abr.length > 1 ? abr : abr + workspace.name.slice(1, 2).toUpperCase();

        console.log(abrWorkspace);

        abr = loop(abrWorkspace) as string;
        newWorkspaces.push({
          ...workspace,
          abbreviation: abr,
        });
      });
    }

    const company = await this.companyRepository.update(
      { ...updateCompanyDto, workspace: newWorkspaces },
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
}
