import { Injectable } from '@nestjs/common';

import { ConsolidatedViewExclusionReasonEnum } from '@/@v2/enterprise/company/application/company-group/consolidated-view/constants/consolidated-view-exclusion-reason.enum';
import { FormApplicationScopeTypeEnum } from '@/@v2/forms/domain/enums/form-application-scope-type.enum';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { PrismaService } from '@/prisma/prisma.service';

import { CompanyGroupConsolidatedViewMetricsService } from './company-group-consolidated-view-metrics.service';
import { FormApplicationStructureFingerprintService } from './form-application-structure-fingerprint.service';

export type ConsolidatedViewEligibleApplication = {
  applicationId: string;
  applicationName: string;
  companyId: string;
  companyLabel: string;
  totalParticipants: number;
  totalAnswers: number;
};

export type ConsolidatedViewEligibleSet = {
  formId: string;
  formName: string;
  includedFormIds: string[];
  structureFingerprint: string;
  applications: ConsolidatedViewEligibleApplication[];
};

export type ConsolidatedViewExcludedApplication = {
  applicationId: string;
  applicationName: string;
  companyId: string;
  companyLabel: string;
  reason: ConsolidatedViewExclusionReasonEnum;
};

type CandidateApplication = {
  id: string;
  name: string;
  status: string;
  formId: string;
  formName: string;
  companyId: string;
  companyLabel: string;
  groupId: number | null;
  scopeType: FormApplicationScopeTypeEnum;
};

@Injectable()
export class CompanyGroupConsolidatedViewEligibilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fingerprintService: FormApplicationStructureFingerprintService,
    private readonly metricsService: CompanyGroupConsolidatedViewMetricsService,
  ) {}

  async evaluate(params: {
    companyGroupId: number;
    accessibleCompanyIds: string[];
    applicationIds?: string[];
  }): Promise<{
    eligibleSets: ConsolidatedViewEligibleSet[];
    excludedApplications: ConsolidatedViewExcludedApplication[];
    hasEligibleSet: boolean;
  }> {
    const candidates = await this.loadCandidates(params);
    const excludedApplications: ConsolidatedViewExcludedApplication[] = [];
    const validCandidates: CandidateApplication[] = [];

    for (const candidate of candidates) {
      const exclusionReason = this.getExclusionReason({
        candidate,
        companyGroupId: params.companyGroupId,
        accessibleCompanyIds: params.accessibleCompanyIds,
      });

      if (exclusionReason) {
        excludedApplications.push({
          applicationId: candidate.id,
          applicationName: candidate.name,
          companyId: candidate.companyId,
          companyLabel: candidate.companyLabel,
          reason: exclusionReason,
        });
        continue;
      }

      validCandidates.push(candidate);
    }

    const metrics = await this.metricsService.getMetricsForApplications(
      validCandidates.map((candidate) => candidate.id),
    );

    const fingerprintMap = await this.fingerprintService.computeFingerprints(
      validCandidates.map((candidate) => candidate.id),
    );

    const eligibleSets: ConsolidatedViewEligibleSet[] = [];
    const candidatesByFingerprint = this.groupBy(validCandidates, (candidate) =>
      fingerprintMap.get(candidate.id) || '',
    );

    for (const [fingerprint, fingerprintCandidates] of candidatesByFingerprint) {
      if (!fingerprint || fingerprintCandidates.length < 2) {
        continue;
      }

      const referenceForm = this.pickReferenceForm(fingerprintCandidates);

      eligibleSets.push({
        formId: referenceForm.formId,
        formName: referenceForm.formName,
        includedFormIds: referenceForm.includedFormIds,
        structureFingerprint: fingerprint,
        applications: fingerprintCandidates.map((candidate) => {
          const candidateMetrics = metrics.get(candidate.id);

          return {
            applicationId: candidate.id,
            applicationName: candidate.name,
            companyId: candidate.companyId,
            companyLabel: candidate.companyLabel,
            totalParticipants: candidateMetrics?.totalParticipants ?? 0,
            totalAnswers: candidateMetrics?.totalAnswers ?? 0,
          };
        }),
      });
    }

    const eligibleApplicationIds = new Set(
      eligibleSets.flatMap((set) =>
        set.applications.map((application) => application.applicationId),
      ),
    );

    for (const candidate of validCandidates) {
      if (eligibleApplicationIds.has(candidate.id)) {
        continue;
      }

      if (
        excludedApplications.some(
          (excluded) => excluded.applicationId === candidate.id,
        )
      ) {
        continue;
      }

      const fingerprint = fingerprintMap.get(candidate.id) || '';
      const sameFingerprintCount = validCandidates.filter(
        (item) => fingerprintMap.get(item.id) === fingerprint,
      ).length;

      if (sameFingerprintCount < 2) {
        continue;
      }

      excludedApplications.push({
        applicationId: candidate.id,
        applicationName: candidate.name,
        companyId: candidate.companyId,
        companyLabel: candidate.companyLabel,
        reason: ConsolidatedViewExclusionReasonEnum.INCOMPATIBLE_STRUCTURE,
      });
    }

    return {
      eligibleSets: eligibleSets.sort(
        (left, right) => right.applications.length - left.applications.length,
      ),
      excludedApplications,
      hasEligibleSet: eligibleSets.some((set) => set.applications.length >= 2),
    };
  }

  private pickReferenceForm(candidates: CandidateApplication[]): {
    formId: string;
    formName: string;
    includedFormIds: string[];
  } {
    const formCounts = new Map<string, { count: number; formName: string }>();

    for (const candidate of candidates) {
      const current = formCounts.get(candidate.formId) || {
        count: 0,
        formName: candidate.formName,
      };

      formCounts.set(candidate.formId, {
        count: current.count + 1,
        formName: current.formName,
      });
    }

    const includedFormIds = [...formCounts.keys()].sort();
    const [formId, reference] = [...formCounts.entries()].sort((left, right) => {
      if (right[1].count !== left[1].count) {
        return right[1].count - left[1].count;
      }

      return left[0].localeCompare(right[0]);
    })[0]!;

    return {
      formId,
      formName: reference.formName,
      includedFormIds,
    };
  }

  private getExclusionReason(params: {
    candidate: CandidateApplication;
    companyGroupId: number;
    accessibleCompanyIds: string[];
  }): ConsolidatedViewExclusionReasonEnum | null {
    const { candidate, companyGroupId, accessibleCompanyIds } = params;

    if (candidate.groupId !== companyGroupId) {
      return ConsolidatedViewExclusionReasonEnum.NOT_SAME_GROUP;
    }

    if (!accessibleCompanyIds.includes(candidate.companyId)) {
      return ConsolidatedViewExclusionReasonEnum.NO_ACCESS;
    }

    if (candidate.status !== FormStatusEnum.DONE) {
      return ConsolidatedViewExclusionReasonEnum.NOT_DONE;
    }

    return null;
  }

  private async loadCandidates(params: {
    companyGroupId: number;
    accessibleCompanyIds: string[];
    applicationIds?: string[];
  }): Promise<CandidateApplication[]> {
    const { accessibleCompanyIds, applicationIds } = params;

    const applications = await this.prisma.formApplication.findMany({
      where: {
        deleted_at: null,
        ...(applicationIds?.length ? { id: { in: applicationIds } } : {}),
        OR: [
          { company_id: { in: accessibleCompanyIds } },
          {
            applicationCompanies: {
              some: { company_id: { in: accessibleCompanyIds } },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        form_id: true,
        company_id: true,
        scope_type: true,
        form: { select: { name: true } },
        company: {
          select: {
            id: true,
            name: true,
            fantasy: true,
            initials: true,
            groupId: true,
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    return applications
      .filter(
        (application) =>
          application.scope_type !==
          FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES,
      )
      .map((application) => ({
        id: application.id,
        name: application.name,
        status: application.status,
        formId: application.form_id,
        formName: application.form.name,
        companyId: application.company_id,
        companyLabel: this.getCompanyLabel(application.company),
        groupId: application.company.groupId,
        scopeType: application.scope_type as FormApplicationScopeTypeEnum,
      }));
  }

  private getCompanyLabel(company: {
    name: string;
    fantasy: string | null;
    initials: string | null;
  }) {
    const initials = company.initials?.trim()
      ? `(${company.initials.trim()})`
      : '';
    const name = company.fantasy?.trim() || company.name?.trim() || '';

    return (initials ? `${initials} ` : '') + name;
  }

  private groupBy<T, K extends string | number>(
    items: T[],
    getKey: (item: T) => K,
  ): Map<K, T[]> {
    const groups = new Map<K, T[]>();

    for (const item of items) {
      const key = getKey(item);
      const current = groups.get(key) || [];
      current.push(item);
      groups.set(key, current);
    }

    return groups;
  }
}
