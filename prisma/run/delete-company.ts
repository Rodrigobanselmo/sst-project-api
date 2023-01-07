import { PrismaClient } from '@prisma/client';

export const deleteWithNameCompany = async (name: string, prisma: PrismaClient) => {
  const company = await prisma.company.findMany({
    where: { name },
  });

  try {
    await Promise.all(
      company.map(async ({ id }) => {
        return deleteCompany(id, prisma);
      }),
    );
  } catch (error) {
    console.error(error);
    console.error('error: end');
  }
  console.error('end');
};

export const deleteCompany = async (id: string, prisma: PrismaClient) => {
  // await prisma.examToRisk.deleteMany({
  //   where: { companyId: id },
  // });
  // await prisma.engsToRiskFactorData.deleteMany({
  //   where: { riskFactorData: { companyId: id } },
  // });
  // await prisma.epiToRiskFactorData.deleteMany({
  //   where: { riskFactorData: { companyId: id } },
  // });
  // await prisma.examToRiskData.deleteMany({
  //   where: { risk: { companyId: id } },
  // });
  // await prisma.employeeExamsHistory.deleteMany({
  //   where: { employee: { companyId: id } },
  // });
  // await prisma.employeeHierarchyHistory.deleteMany({
  //   where: { employee: { companyId: id } },
  // });
  // await prisma.riskFactorData.deleteMany({
  //   where: { companyId: id },
  // });
  // await prisma.attachments.deleteMany({
  //   where: { riskFactorDocument: { companyId: id } },
  // });
  // await prisma.riskFactorDocument.deleteMany({
  //   where: { companyId: id },
  // });
  // await prisma.riskFactorsDocInfo.deleteMany({
  //   where: { companyId: id },
  // });
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
  await prisma.companyEnvironmentPhoto.deleteMany({
    where: {
      companyEnvironment: {
        OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }],
      },
    },
  });
  await prisma.companyCharacterizationPhoto.deleteMany({
    where: {
      companyEnvironment: {
        OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }],
      },
    },
  });
  await prisma.companyCharacterization.deleteMany({
    where: { OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }] },
  });
  await prisma.companyEnvironment.deleteMany({
    where: { OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }] },
  });

  console.count();
  await prisma.homogeneousGroup.deleteMany({ where: { companyId: id } });
  console.count();
  await prisma.hierarchy.deleteMany({ where: { companyId: id } });
  console.count();
  await prisma.workspace.deleteMany({
    where: { companyId: id },
  });
  console.count();
  await prisma.contact.deleteMany({
    where: { companyId: id },
  });
  console.count();
  await prisma.contract.deleteMany({
    where: { receivingServiceCompanyId: id },
  });
  console.count();
  await prisma.contract.deleteMany({
    where: { applyingServiceCompanyId: id },
  });
  console.count();
  await prisma.generateSource.deleteMany({
    where: { companyId: id },
  });
  console.count();
  await prisma.inviteUsers.deleteMany({
    where: { companyId: id },
  });
  console.count();
  await prisma.company.delete({ where: { id } });
};
