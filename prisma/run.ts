import { AmazonStorageProvider } from './../src/shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CharacterizationRepository } from './../src/modules/company/repositories/implementations/CharacterizationRepository';
import { UpsertCharacterizationService } from './../src/modules/company/services/characterization/upsert-characterization/upsert-characterization.service';
import { PrismaClient } from '@prisma/client';
import { deleteWithNameCompany } from './run/delete-company';
import { levelRiskData } from './run/level-risk-data';

import { representAll } from './run/represent-all';
import { CharacterizationPhotoRepository } from '../src/modules/company/repositories/implementations/CharacterizationPhotoRepository';
import { deleteProfessionalsConnections } from './run/delete-professionals-connections';
import { addProfCOuncilNUll } from './run/create-professional-council';
import { seedEsocial24 } from './seed/read_24';

const prisma = new PrismaClient();

async function main() {
  try {
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
    // await levelRiskData(prisma);
    // await representAll(prisma);
    // await seedEsocial24(prisma);

    // await deleteProfessionalsConnections(prisma);
    // await addProfCOuncilNUll(prisma);

    // const group = await prisma.employeeESocialEvent.groupBy({
    //   by: ['status'],
    //   _count: true,
    // });

    console.log('end');
  } catch (err) {
    console.error(err);
  }
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
