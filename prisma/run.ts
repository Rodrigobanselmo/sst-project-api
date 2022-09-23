import { AmazonStorageProvider } from './../src/shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CharacterizationRepository } from './../src/modules/company/repositories/implementations/CharacterizationRepository';
import { UpsertCharacterizationService } from './../src/modules/company/services/characterization/upsert-characterization/upsert-characterization.service';
import { PrismaClient } from '@prisma/client';
import { deleteWithNameCompany } from './run/delete-company';
import { levelRiskData } from './run/level-risk-data';

import { representAll } from './run/represent-all';
import { CharacterizationPhotoRepository } from '../src/modules/company/repositories/implementations/CharacterizationPhotoRepository';

const prisma = new PrismaClient();

async function main() {
  console.log('start');

  // fs.readFile('text.txt', 'utf8', function (err, data) {
  //   if (err) throw err;
  //   console.log(data.split('\n'));
  // });

  // try {
  //   const x = await prisma.activity.delete({
  //     where: { code: '0' },
  //   });
  //   console.log(x);
  //   // await convertProf(prisma);
  // } catch (error) {
  //   console.log(error);
  //   console.log('error: end');
  // }

  // const data = await prisma.companyCharacterization.findMany({
  //   where: { companyId: '3e992a87-d72c-4d6e-8373-b73dbd9a43f1' },
  // });
  // console.log(data);

  //await deleteWithNameCompany('Deletar', prisma);
  await levelRiskData(prisma);
  await representAll(prisma);

  console.log('end');
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
