import { Inject, Injectable } from '@nestjs/common';

import { FormParticipantsOrderByEnum } from '@/@v2/forms/application/form-participants/browse-form-participants/controllers/browse-form-participants.query';
import { FormParticipantsDAO } from '@/@v2/forms/database/dao/form-participants/form-participants.dao';
import { FormParticipantsBrowseResultModel } from '@/@v2/forms/domain/models/form-participants/form-participants-browse-result.model';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';

import { ConsolidatedViewEligibleApplication } from './company-group-consolidated-view-eligibility.service';
import {
  getFormParticipantHierarchyLabel,
  getFormParticipantOfficeLabel,
  getFormParticipantSectorLabel,
} from '../utils/form-participant-hierarchy-display.util';

export type ConsolidatedViewParticipant = {
  participantId: number;
  applicationId: string;
  companyId: string;
  companyLabel: string;
  workspaceLabel: string | null;
  hierarchyLabel: string;
  sectorLabel: string;
  officeLabel: string | null;
  name: string;
  cpf: string;
  email: string;
  phone: string | null;
  hasAnswered: boolean;
};

export type ConsolidatedViewParticipantsFilterSummary = {
  totalParticipants: number;
  respondedCount: number;
  notRespondedCount: number;
  responseRatePercent: number;
};

export type ConsolidatedViewParticipantsResult = {
  participants: ConsolidatedViewParticipant[];
  totals: {
    totalParticipants: number;
    totalResponded: number;
    totalNotResponded: number;
    completionPercent: number;
  };
  filterSummary: ConsolidatedViewParticipantsFilterSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

const CONSOLIDATED_PARTICIPANTS_MAX_LIMIT = 10_000;
const DEFAULT_PAGE_LIMIT = 50;

@Injectable()
export class CompanyGroupConsolidatedViewParticipantsService {
  constructor(
    private readonly formParticipantsDAO: FormParticipantsDAO,
    @Inject(SharedTokens.Crypto) private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async list(params: {
    applications: ConsolidatedViewEligibleApplication[];
    search?: string;
    hasResponded?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ConsolidatedViewParticipantsResult> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = Math.min(
      params.limit && params.limit > 0 ? params.limit : DEFAULT_PAGE_LIMIT,
      CONSOLIDATED_PARTICIPANTS_MAX_LIMIT,
    );

    const participants = await this.loadParticipants({
      applications: params.applications,
      search: params.search,
      hasResponded: params.hasResponded,
    });

    const totalParticipants = participants.length;
    const totalResponded = participants.filter(
      (participant) => participant.hasAnswered,
    ).length;
    const totalNotResponded = Math.max(totalParticipants - totalResponded, 0);
    const completionPercent =
      totalParticipants > 0
        ? Number(((totalResponded / totalParticipants) * 100).toFixed(2))
        : 0;

    const offset = (page - 1) * limit;
    const paginatedParticipants = participants.slice(offset, offset + limit);

    return {
      participants: paginatedParticipants,
      totals: {
        totalParticipants,
        totalResponded,
        totalNotResponded,
        completionPercent,
      },
      filterSummary: {
        totalParticipants,
        respondedCount: totalResponded,
        notRespondedCount: totalNotResponded,
        responseRatePercent: completionPercent,
      },
      pagination: {
        page,
        limit,
        total: totalParticipants,
      },
    };
  }

  private async loadParticipants(params: {
    applications: ConsolidatedViewEligibleApplication[];
    search?: string;
    hasResponded?: boolean;
  }): Promise<ConsolidatedViewParticipant[]> {
    const merged: ConsolidatedViewParticipant[] = [];

    for (const application of params.applications) {
      const browse = await this.formParticipantsDAO.browse({
        page: 1,
        limit: CONSOLIDATED_PARTICIPANTS_MAX_LIMIT,
        orderBy: [
          {
            field: FormParticipantsOrderByEnum.NAME,
            order: OrderByDirectionEnum.ASC,
          },
        ],
        filters: {
          companyId: application.companyId,
          applicationId: application.applicationId,
          search: params.search,
          hasResponded: params.hasResponded,
        },
        cryptoAdapter: this.cryptoAdapter,
      });

      for (const participant of browse.results) {
        merged.push(
          this.mapParticipant(participant, application),
        );
      }
    }

    return merged.sort((left, right) =>
      left.name.localeCompare(right.name, 'pt-BR', { sensitivity: 'base' }),
    );
  }

  private mapParticipant(
    participant: FormParticipantsBrowseResultModel,
    application: ConsolidatedViewEligibleApplication,
  ): ConsolidatedViewParticipant {
    return {
      participantId: participant.id,
      applicationId: application.applicationId,
      companyId: application.companyId,
      companyLabel: application.companyLabel,
      workspaceLabel: participant.workspaceName,
      hierarchyLabel: getFormParticipantHierarchyLabel(
        participant.hierarchies,
        participant.hierarchyName,
      ),
      sectorLabel: getFormParticipantSectorLabel(
        participant.hierarchies,
        participant.hierarchyName,
      ),
      officeLabel: getFormParticipantOfficeLabel(participant.hierarchies),
      name: participant.name,
      cpf: participant.cpf,
      email: participant.email,
      phone: participant.phone,
      hasAnswered: participant.hasResponded,
    };
  }
}
