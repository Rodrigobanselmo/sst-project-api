import { CharacterizationBrowseModelMapper } from './../src/@v2/security/database/mappers/models/characterization-browse.mapper';
import { normalizeString } from './../src/shared/utils/normalizeString';
import { PermissionCompanyEnum } from './../src/shared/constants/enum/permissionsCompany';
import { asyncEach } from './../src/shared/utils/asyncEach';
import { removeDuplicitiesRisks } from './run/remove-duplicities-risks';
import { AmazonStorageProvider } from './../src/shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CharacterizationRepository } from './../src/modules/company/repositories/implementations/CharacterizationRepository';
import { UpsertCharacterizationService } from './../src/modules/company/services/characterization/upsert-characterization/upsert-characterization.service';
import { Prisma, PrismaClient } from '@prisma/client';
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
  // log: ['query'],
});


type IWhereRawPrismaOptions = {
  type: 'AND' | 'OR',
}

export function gerWhereRawPrisma(where: Prisma.Sql[], options?: IWhereRawPrismaOptions): Prisma.Sql {
  if (where.length === 0) return Prisma.sql``

  const isOR = options?.type == 'OR'

  const raw = isOR
    ? Prisma.join(where, ' OR ')
    : Prisma.join(where, ' AND ')

  return Prisma.sql`WHERE ${raw}`
}
export function gerHavingRawPrisma(having: Prisma.Sql[], options?: IWhereRawPrismaOptions): Prisma.Sql {
  if (having.length === 0) return Prisma.sql``

  const isOR = options?.type == 'OR'

  const raw = isOR
    ? Prisma.join(having, ' OR ')
    : Prisma.join(having, ' AND ')

  return Prisma.sql`HAVING ${raw}`
}

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
    // await removeRisk(prisma)

    // const document = await prisma.companyCharacterization.findMany({
    //   where: { companyId: '4cff7d7b-11f4-4537-a683-8cb3ca5095b8', workspaceId: '004202a3-55ba-43e9-9f84-f66618cba3c9' },
    //   select: {
    //     created_at: true,
    //     updated_at: true,
    //     id: true,
    //     name: true,
    //     type: true,
    //     done_at: true,
    //     order: true,
    //     homogeneousGroup: {
    //       select: {
    //         hierarchyOnHomogeneous: {
    //           select: {
    //             hierarchy: {
    //               select: {
    //                 name: true
    //               }
    //             }
    //           }
    //         },
    //         riskFactorData: {
    //           where: {
    //             riskFactor: {
    //               representAll: false
    //             }
    //           },
    //           select: {
    //             riskFactor: {
    //               select: {
    //                 name: true,
    //                 id: true
    //               }
    //             },
    //           }
    //         }
    //       }
    //     },
    //     profiles: {
    //       select: {
    //         id: true,
    //         profileName: true,
    //       }
    //     },
    //     _count: {
    //       select: {
    //         photos: true,
    //       }
    //     }
    //   }
    // })

    const companyId = 'd1309cad-19d4-4102-9bf9-231f91095c20'
    const workspaceId = 'f588207b-ac7b-4b63-9d85-cd5753f9b288'
    // const companyId = '4cff7d7b-11f4-4537-a683-8cb3ca5095b8'
    // const workspaceId = '004202a3-55ba-43e9-9f84-f66618cba3c9'


    const orderBy = [['total_risks', 'desc'], ['total_profiles', 'asc']];



    // const field = Prisma.sql([`total_risks`]);
    // const direction = Prisma.sql(['desc']);
    // const field2 = Prisma.sql([`total_profiles`]);
    // const direction2 = Prisma.sql(['asc']);

    // const prismaOrderBy = orderBy.map(([field, direction]) => ([Prisma.sql([field]), Prisma.sql([direction])]))
    const prismaOrderBy = orderBy.map(([field, direction]) => (Prisma.sql`${Prisma.sql([field])} ${Prisma.sql([direction])}`))
    const prismaOrderBySQL = Prisma.join(prismaOrderBy, ', ')

    const num = 2

    const where = [
      Prisma.sql`cc."companyId" = ${companyId}`,
      Prisma.sql`cc."workspaceId" = ${workspaceId}`,
      Prisma.sql`cc."profileParentId" IS NULL`,
    ]
    const havingOR = [
      Prisma.sql`COUNT(DISTINCT ph.id) = ${3}`,
      Prisma.sql`COUNT(DISTINCT rfd.id) = ${3}`,
    ]
    const having = [
      Prisma.join(havingOR, ' OR '),
      Prisma.sql`cc.name IS NOT NULL`,
    ]

    const wherePrisma = Prisma.join(where, ' AND ')
    const havingPrisma = gerWhereRawPrisma(having)

    const documents = await prisma.$queryRaw<any>`
      SELECT 
        COUNT(DISTINCT rfd.id) AS total_risks,
        COUNT(DISTINCT profile.id) AS total_profiles,
        COUNT(DISTINCT h.id) AS total_hierarchies,
        COUNT(DISTINCT ph.id) AS total_photos
      FROM 
        "CompanyCharacterization" cc
      LEFT JOIN 
        "HomogeneousGroup" hg ON cc.id = hg.id
      LEFT JOIN 
        "HierarchyOnHomogeneous" hh ON hg.id = hh."homogeneousGroupId" AND hh."endDate" IS NULL
      LEFT JOIN 
        "Hierarchy" h ON hh."hierarchyId" = h.id
      LEFT JOIN 
        "RiskFactorData" rfd ON hg.id = rfd."homogeneousGroupId"
      LEFT JOIN 
        "RiskFactors" rf ON rfd."riskId" = rf.id AND rf."representAll" = false
      LEFT JOIN 
        "CompanyCharacterization" profile ON cc.id = profile."profileParentId"
      LEFT JOIN 
        "CompanyCharacterizationPhoto" ph ON cc.id = ph."companyCharacterizationId"
      WHERE ${wherePrisma}
      GROUP BY 
        cc.created_at, cc.updated_at, cc.id, cc.name, cc.type, cc.done_at, cc.order
      ORDER BY ${prismaOrderBySQL};
    `;

    function serializeBigInt(key, value) {
      return typeof value === 'bigint' ? value.toString() : value;
    }


    // console.log(JSON.stringify(CharacterizationBrowseModelMapper.toModels(documents), null, 2))
    console.log(JSON.stringify(documents, serializeBigInt, 2))



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
