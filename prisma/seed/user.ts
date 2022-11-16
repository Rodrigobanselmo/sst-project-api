import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { PermissionEnum, RoleEnum } from '../../src/shared/constants/enum/authorization';

export const seedUsers = async (prisma: PrismaClient, companyId: string) => {
  const passwordHash = await hash('aaaa0123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@simple.com',
      password: passwordHash,
      companies: {
        create: [
          {
            companyId: companyId,
            roles: [RoleEnum.MASTER],
            permissions: [PermissionEnum.MASTER],
          },
        ],
      },
    },
  });
};
