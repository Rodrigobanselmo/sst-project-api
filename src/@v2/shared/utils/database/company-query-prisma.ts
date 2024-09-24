import { Prisma } from '@prisma/client'

export class CompanyQueries {
    static CompanyAndConsultantFilter({ companyId }: { companyId: string }) {
        const where = {
            OR: [{
                id: companyId
            }, {
                applyingServiceContracts: {
                    some: {
                        receivingServiceCompanyId: companyId, status: 'ACTIVE'
                    },
                },
            }]
        } satisfies Prisma.CompanyFindFirstArgs['where']

        return where
    }
}
