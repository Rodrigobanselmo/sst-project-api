import { PrismaService } from 'src/prisma/prisma.service';

export const excelWorkplaceNotes = async (
  prisma: PrismaService,
  companyId: string,
) => {
  const workplaces = await prisma.workspace.findMany({
    where: { companyId },
  });

  return workplaces.map((workplace) => {
    return `${workplace.id} - ${workplace.name}`;
  });
};
