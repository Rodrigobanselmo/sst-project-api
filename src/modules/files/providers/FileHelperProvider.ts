import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FileHelperProvider {
  constructor(private readonly prisma: PrismaService) {}

  public async checkWorkspace(companyId: string, workspaces?: string[]) {
    const workspace = await this.prisma.workspace.findMany({
      where: { companyId },
      select: { id: true, abbreviation: true, name: true },
    });

    if (workspaces) {
      const workspaceCheck = workspaces?.map((workspaceToCheck) => {
        const found = workspace.find((w) => w.abbreviation == workspaceToCheck || w.name == workspaceToCheck);
        if (!found)
          throw new BadRequestException(`Estabelecimento "${workspaceToCheck}" não encontrado para essa empresa`);

        return found;
      });

      return workspaceCheck;
    }

    if (workspace.length == 0) throw new BadRequestException(`Nenhum estabelecimento cadastrado para esta empresa`);
    if (workspace.length > 1) throw new BadRequestException(`Informe o estabelecimento, este dado é obrigatório`);

    if (workspace.length == 1) return workspace;
  }
}
