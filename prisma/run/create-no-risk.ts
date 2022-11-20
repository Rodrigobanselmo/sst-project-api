import { PrismaClient } from '@prisma/client';

export const CreateAbsenceRisk = async (prisma: PrismaClient) => {
  await prisma.riskFactors.create({
    data: {
      name: 'Ausência de Risco',
      system: true,
      companyId: 'b8635456-334e-4d6e-ac43-cfe5663aee17',
      severity: 0,
      representAll: false,
      type: 'OUTROS',
      isPPP: true,
      isAso: true,
      isPCMSO: true,
      isPGR: true,
      esocialCode: '09.01.001',
    },
  });
};
