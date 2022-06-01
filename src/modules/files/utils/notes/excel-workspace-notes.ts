import { PrismaService } from '../../../../prisma/prisma.service';

export const excelWorkspaceNotes = async (
  prisma: PrismaService,
  companyId: string,
) => {
  const workspaces = await prisma.workspace.findMany({
    where: { companyId },
  });

  return workspaces.map((workspace) => {
    return `${workspace.abbreviation}`;
  });
};
