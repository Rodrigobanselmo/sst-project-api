import { PrismaClient } from '@prisma/client';

export const convertProf = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();

  Promise.all(
    users.map(async (user) => {
      const {
        // certifications,
        // councilId,
        // councilUF,
        // councilType,
        // crm,
        // crea,
        cpf,
        phone,
        // formation,
        name,
        id,
        email,
      } = user;

      await prisma.user.update({
        where: { id: id },
        data: {
          professional: {
            upsert: {
              update: {
                // certifications,
                // councilId,
                // councilUF,
                // councilType,
                // crm,
                // crea,
                cpf,
                phone,
                // formation,
                name,
              },
              create: {
                // certifications,
                // councilId,
                // councilUF,
                // councilType,
                // crm,
                // crea,
                cpf,
                phone,
                // formation,
                name,
                email,
              },
            },
          },
        },
      });
    }),
  );
};
