import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ExamMapper } from '../../models/exam.mapper'
import { IExamDAO } from './exam.types'
import { RiskDAO } from '../risk/risk.dao'
import { CompanyQueries } from '@/@v2/shared/utils/database/company.queries'


@Injectable()
export class ExamDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions({ companyId }: { companyId: string }) {
    const include = {
      examToRisk: {
        where: this.ExamRiskFilter({ companyId }),
        include: {
          risk: RiskDAO.selectOptions({ companyId }),
        },
      },
    } satisfies Prisma.ExamFindFirstArgs['include']

    return { include }
  }

  async findMany({ companyId }: IExamDAO.FindManyParams) {
    const exams = await this.prisma.exam.findMany({
      where: {
        OR: [
          {
            // find exams that are linked in risks in the company or consultant
            examToRisk: {
              some: ExamDAO.ExamRiskFilter({ companyId })
            }
          }, {
            //exams linked to riskData
            examToRiskData: {
              some: {
                risk: { companyId },
                examId: { gt: 0 },
              },
            },
          }]
      },
      ...ExamDAO.selectOptions({ companyId })
    })

    return ExamMapper.toModels(exams)
  }

  static ExamRiskFilter({ companyId }: { companyId: string }) {
    const where = {
      deletedAt: null,
      skipCompanies: { none: { companyId } },
      company: CompanyQueries.CompanyAndConsultantFilter({ companyId }),
      risk: {
        OR: [{
          // exams that have an riskData and has set standardExams as true
          riskFactorData: {
            some: {
              companyId,
              standardExams: true
            }
          }
        }, {
          // exams that are in risk that represent all (outros) 
          representAll: true
        }]
      }
    } satisfies Prisma.ExamToRiskFindFirstArgs['where']

    return where
  }
}
