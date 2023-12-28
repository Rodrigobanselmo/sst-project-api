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

const prisma = new PrismaClient({
  log: ['query'],
});

async function main() {
  try {
    console.info('start');
    const allEmployeesPromise = await prisma.employee.findMany({
      where: {
        status: { not: 'CANCELED' },
      },

      take: 1,
      select: {
        id: true,
        companyId: true,
        hierarchyId: true,
        lastExam: true,
        status: true,
        hierarchy: {
          select: {
            id: true,
            parent: {
              select: {
                id: true,
                parent: {
                  select: {
                    id: true,
                    parent: {
                      select: {
                        id: true,
                        parent: { select: { id: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        expiredDateExam: true,
        hierarchyHistory: {
          take: 2,
          select: { startDate: true, motive: true, hierarchyId: true },
          orderBy: { startDate: 'desc' },
        },

        birthday: true,
        sex: true,
        subOffices: { select: { id: true } },
        examsHistory: {
          select: {
            doneDate: true,
            expiredDate: true,
            status: true,
            examType: true,
            evaluationType: true,
            hierarchyId: true,
            validityInMonths: true,
            examId: true,
            exam: {
              select: { isAttendance: true },
            },
          },
          orderBy: { doneDate: 'desc' },
          distinct: ['examId', 'status'],
          where: {
            exam: { isAvaliation: false },
            status: { in: ['DONE'] },
          },
        },
      },
    });

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
