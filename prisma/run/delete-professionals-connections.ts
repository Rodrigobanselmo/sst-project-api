import { PrismaClient } from '@prisma/client';

export const deleteProfessionalsConnections = async (prisma: PrismaClient) => {
  await prisma.company.updateMany({
    data: { doctorResponsibleId: null, tecResponsibleId: null },
  });
  await prisma.companyGroup.updateMany({
    data: { doctorResponsibleId: null },
  });
  await prisma.employeeExamsHistory.updateMany({
    data: { doctorId: null },
  });

  await prisma.riskFactorGroupDataToProfessional.deleteMany({});
  await prisma.documentPCMSOToProfessional.deleteMany({});
};
