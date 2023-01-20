import { removeDuplicitiesRisks } from './run/remove-duplicities-risks';
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
import { normalizeUnitRisks } from './run/normalize-unit-risks';
import { changeRecMed } from './run/change-rec-med';
import { CreateAbsenceRisk as createAbsenceRisk } from './run/create-no-risk';
import { addEsocialTables } from './seed/addEsocialTables';
import { motiveTables } from './seed/motiveTables';
import { cid10Table } from './seed/cid10Table';
import { deleteRecMed } from './run/delete-rec-med';
import { cboTable } from './seed/cboTable';
import { deleteReapeatHH } from './run/delete-hh-repeat';
import { normCityAddress } from './run/nomalize-city-address';
import { scheduleBlockNational } from './seed/scheduleBlockNational';
import { fixDate } from './run/fix-date';
import { normCities } from './run/normalize-cities';
import { fixHierarchyHomo } from './run/fix-hierarchy-homo';

const prisma = new PrismaClient({
  // log: ['query'],
});

async function main() {
  try {
    // const group = await prisma.employeeESocialEvent.groupBy({
    //   by: ['status'],
    //   _count: true,
    // });

    //await deleteWithNameCompany('Deletar', prisma);
    // await representAll(prisma); //* DONE
    // await changeRecMed(prisma); //* DONE
    // await createAbsenceRisk(prisma); //* DONE
    // await levelRiskData(prisma); //* DONE
    // await removeDuplicitiesRisks(prisma); //* DONE

    // await deleteProfessionalsConnections(prisma); //? DONE
    // await addProfCOuncilNUll(prisma); //*? DONE

    // await seedEsocial24(prisma);
    // await cid10Table(prisma);
    // await addEsocialTables(prisma);
    // await motiveTables(prisma);

    // await deleteRecMed(prisma);
    // await deleteReapeatHH(prisma);
    // await cboTable(prisma);
    // await normCityAddress(prisma);
    // await scheduleBlockNational(prisma);
    // await fixDate(prisma);
    // await normCities(prisma);

    //*next
    await fixHierarchyHomo(prisma);

    //   await prisma.$queryRaw`select
    //   id, name
    // from users
    //   where LOWER(unaccent(name)) LIKE ${'filterText'};`.then((users) => console.info(users));

    // await prisma.cities.findMany({
    //   where: { name: { contains: 'Sa', mode: 'insensitive' } },
    //   skip: 0,
    //   take: 20,
    //   orderBy: { name: 'asc' },
    //   select: { code: true, name: true, uf: { select: { uf: true } } },
    // }),
    console.info('end');
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
