import { normalizeString } from './../src/shared/utils/normalizeString';
import { PermissionCompanyEnum } from './../src/shared/constants/enum/permissionsCompany';
import { asyncEach } from './../src/shared/utils/asyncEach';
import { removeDuplicitiesRisks } from './run/remove-duplicities-risks';
import { AmazonStorageProvider } from './../src/shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CharacterizationRepository } from './../src/modules/company/repositories/implementations/CharacterizationRepository';
import { UpsertCharacterizationService } from './../src/modules/company/services/characterization/upsert-characterization/upsert-characterization.service';
import { PrismaClient } from '@prisma/client';
import { deleteCompany, deleteWithNameCompany } from './run/delete-company';
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
import { removeDuplicatesRisks } from './run/removeDuplicatesRisks';
import { setHomoWork } from './run/set-homo-work';
import { emptyDocTables } from './run/empty-doc-tables';
import { createEpi } from './run/create-epi';
import { hash } from 'bcrypt';
import { readFileSync, createWriteStream, writeFileSync, readdirSync } from 'fs';
import { signPdf } from './signature/signPdf';
import { asyncBatch } from './../src/shared/utils/asyncBatch';
import { realizaCover } from './run/realiza-cover';
import { removeRisk } from './run/remove-risks-000deletar';

const prisma = new PrismaClient({
  log: ['query'],
});

async function main() {
  try {
    console.info('start');

    // const companyIds = ['6a90957b-ea2a-4dba-b88e-ee128562718a', '87544c8e-8827-4429-a3d6-ec62f486fc5b']

    // const charId = "1e19f768-2fd0-47aa-b1bd-e5a9328ec0ee"

    // await prisma.employeePPPHistory.deleteMany({ where: { employee: { companyId: { in: companyIds } } } })
    // await prisma.employeeExamsHistory.deleteMany({ where: { employee: { companyId: { in: companyIds } } } })
    // await prisma.employeeHierarchyHistory.deleteMany({ where: { employee: { companyId: { in: companyIds } } } })
    // await prisma.employeeESocialEvent.deleteMany({ where: { companyId: { in: companyIds } } })
    // await prisma.employeeESocialBatch.deleteMany({ where: { companyId: { in: companyIds } } })
    // await prisma.employee.deleteMany({ where: { companyId: { in: companyIds } } })

    // await prisma.companyCharacterizationFile.deleteMany({ where: { companyCharacterizationId: charId } })
    // await prisma.companyCharacterizationPhoto.deleteMany({ where: { companyCharacterizationId: charId } })
    // await prisma.companyCharacterization.delete({ where: { id: charId } })
    // await prisma.hierarchy.deleteMany({ where: { companyId: { in: companyIds } } })




    // await realizaCover(prisma)
    await removeRisk(prisma)


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
