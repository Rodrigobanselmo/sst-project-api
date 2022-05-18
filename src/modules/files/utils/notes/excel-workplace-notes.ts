import { PrismaService } from '../../../../prisma/prisma.service';

export const excelWorkplaceNotes = async (
  prisma: PrismaService,
  companyId: string,
) => {
  const workplaces = await prisma.workspace.findMany({
    where: { companyId },
  });

  return workplaces.map((workplace) => {
    return `${workplace.abbreviation}`;
  });
};
