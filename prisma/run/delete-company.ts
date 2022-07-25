import { PrismaClient } from '@prisma/client';

export const deleteCompany = async (id: string, prisma: PrismaClient) => {
  await prisma.riskFactorData.deleteMany({
    where: { companyId: id },
  });
  // await prisma.riskFactorGroupData.deleteMany({
  //   where: { companyId: id },
  // });
  // await prisma.databaseTable.deleteMany({
  //   where: { companyId: id },
  // });
  // await prisma.contract.deleteMany({
  //   where: { receivingServiceCompanyId: id },
  // });
  // await prisma.employee.deleteMany({ where: { companyId: id } });
  // await prisma.hierarchyOnHomogeneous.deleteMany({
  //   where: { hierarchy: { companyId: id } },
  // });
  await prisma.companyCharacterization.deleteMany({
    where: { companyId: id },
  });

  await prisma.homogeneousGroup.deleteMany({ where: { companyId: id } });
  // await prisma.hierarchy.deleteMany({ where: { companyId: id } });
  // await prisma.workspace.deleteMany({
  //   where: { companyId: id },
  // });
  // await prisma.company.delete({ where: { id } });
};
