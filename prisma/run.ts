import { PrismaClient } from '@prisma/client';
import { convertEpi } from './run/convert-epi';
import { deleteCompany } from './run/delete-company';

const prisma = new PrismaClient();

async function main() {
  console.log('start');
  try {
    // await prisma.license.create()
    // await deleteCompany('4c8c2000-c70c-4285-992d-26d7d8f683cb', prisma);
    //? trocar env to char
    // const test = await prisma.homogeneousGroup.findMany({
    //   where: {
    //     type: { in: ['EQUIPMENT', 'ACTIVITIES', 'WORKSTATION', 'ENVIRONMENT'] },
    //     companyId: 'd1309cad-19d4-4102-9bf9-231f91095c20',
    //   },
    //   include: { characterization: true, environment: true },
    // });
    // const test = await prisma.company.findUnique({
    //   where: {
    //     id: 'd1309cad-19d4-4102-9bf9-231f91095c20',
    //   },
    //   include: { characterization: { include: { photos: true } } },
    // });

    const data = await prisma.companyCharacterization.findMany();
    await Promise.all(
      data.map(async (characterization) => {
        if (characterization.description) {
          await prisma.companyCharacterization.update({
            data: {
              description: '',
              paragraphs: [characterization.description],
            },
            where: { id: characterization.id },
          });
        }
      }),
    );
    // Promise.all(
    //   test
    //     .filter((item) => !item.characterization && !item.environment)
    //     .map(async ({ id }) => {
    //       await prisma.hierarchyOnHomogeneous.deleteMany({
    //         where: { homogeneousGroupId: id },
    //       });

    //       await prisma.riskFactorData.deleteMany({
    //         where: { homogeneousGroupId: id },
    //       });

    //       await prisma.homogeneousGroup.delete({
    //         where: { id },
    //       });
    //     }),
    // );

    // console.log('test', test);
    // convertEpi(prisma);
  } catch (error) {
    console.log(error);
    console.log('error: end');
  }
  console.log('end');
}

// https://prod-simplesst-docs.s3.amazonaws.com/d1309cad-19d4-4102-9bf9-231f91095c20/characterization/7628dbd8-6f13-4f38-ba3f-8f0705f56ce6.jpeg'

//https://prod-simplesst-docs.s3.amazonaws.com/d1309cad-19d4-4102-9bf9-231f91095c20/characterization/2b36909c-2d34-497a-a5fc-1a1a83685658.jpeg

// https://prod-simplesst-docs.s3.amazonaws.com/d1309cad-19d4-4102-9bf9-231f91095c20/characterization/42a683b1-bd2f-40ae-9516-66ddcd10f307.jpeg

//https://prod-simplesst-docs.s3.amazonaws.com/d1309cad-19d4-4102-9bf9-231f91095c20/characterization/b0220fc0-a74e-43b1-86b9-384248fa33ca.jpeg

//https://prod-simplesst-docs.s3.amazonaws.com/d1309cad-19d4-4102-9bf9-231f91095c20/characterization/47e91466-ce52-4868-8ab3-5cfbcb7884b5.jpeg
main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
