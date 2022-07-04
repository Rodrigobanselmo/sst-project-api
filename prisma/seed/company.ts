import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

export const seedCompany = async (
  prisma: PrismaClient,
  options?: { skip?: true },
) => {
  const id =
    process.env.NODE_ENV === 'test'
      ? '1'
      : 'b8635456-334e-4d6e-ac43-cfe5663aee17';

  const workId = v4();

  if (options?.skip) {
    return { workId, companyId: id, company: {} };
  }

  const company = await prisma.company.upsert({
    create: {
      id,
      cnpj: '07.689.002/0001-89',
      fantasy: 'Simple',
      name: 'Simplesst LTDA',
      status: 'ACTIVE',
      type: 'MASTER',
      license: { create: { companyId: id } },
      workspace: {
        create: {
          name: 'MATRIZ',
          abbreviation: 'MA',
          id: workId,
          address: { create: { cep: '12246-000' } },
        },
      },
    },
    update: {},
    include: { workspace: true },
    where: { id },
  });

  return { workId: company.workspace[0].id, companyId: id, company };
};
