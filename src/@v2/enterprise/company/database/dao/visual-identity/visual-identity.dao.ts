import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { IVisualIdentityDAO } from './visual-identity.types'

@Injectable()
export class VisualIdentityDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async read({ companyId }: IVisualIdentityDAO.ReadParams): Promise<IVisualIdentityDAO.VisualIdentityResult> {
    // Get company with its consultant in a single query
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        metadata: true,
        receivingServiceContracts: {
          where: { status: 'ACTIVE' },
          select: {
            applyingServiceCompany: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                metadata: true,
                isConsulting: true,
                isGroup: true,
                isClinic: true,
              },
            },
          },
        },
      },
    })

    if (!company) {
      return null
    }

    const metadata = (company.metadata as Record<string, any>) || {}

    // If company has visual identity enabled, return its data
    if (metadata.visualIdentityEnabled) {
      return {
        companyId: company.id,
        companyName: company.name,
        primaryColor: metadata.primaryColor || null,
        shortName: metadata.shortName || null,
        logoUrl: company.logoUrl || null,
        customLogoUrl: metadata.customLogoUrl || null,
        sidebarBackgroundColor: metadata.sidebarBackgroundColor || null,
        applicationBackgroundColor: metadata.applicationBackgroundColor || null,
        visualIdentityEnabled: true,
      }
    }

    // Otherwise, try to get the consultant company's visual identity
    const consultantCompany = company.receivingServiceContracts
      .map((contract) => contract.applyingServiceCompany)
      .find((c) => c.isConsulting && !c.isGroup && !c.isClinic)

    if (!consultantCompany) {
      return null
    }

    const consultantMetadata = (consultantCompany.metadata as Record<string, any>) || {}

    // Only return consultant's visual identity if it's enabled
    if (consultantMetadata.visualIdentityEnabled) {
      return {
        companyId: consultantCompany.id,
        companyName: consultantCompany.name,
        primaryColor: consultantMetadata.primaryColor || null,
        shortName: consultantMetadata.shortName || null,
        logoUrl: consultantCompany.logoUrl || null,
        customLogoUrl: consultantMetadata.customLogoUrl || null,
        sidebarBackgroundColor: consultantMetadata.sidebarBackgroundColor || null,
        applicationBackgroundColor: consultantMetadata.applicationBackgroundColor || null,
        visualIdentityEnabled: true,
      }
    }

    return null
  }
}

