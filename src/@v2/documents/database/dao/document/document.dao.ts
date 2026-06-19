import { isFrpsRisk } from '@/@v2/documents/domain/functions/is-frps-risk.func';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import {
  applyDocumentEmissionDateToPgrModel,
  parseDocumentEmissionDate,
} from '@/@v2/documents/libs/docx/helpers/document-emission-date.util';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { Injectable } from '@nestjs/common';
import { DocumentVersionDAO } from '../document-version/document-version.dao';
import { ExamDAO } from '../exam/exam.dao';
import { HierarchyDAO } from '../hierarchy/hierarchy.dao';
import { HomogeneousGroupDAO } from '../homogeneous-group/homogeneous-group.dao';
import { IDocumentDAO } from './document.types';
import { logPgrDiagnostic } from '@/shared/utils/pgr-diagnostic-log.util';

@Injectable()
export class DocumentDAO {
  constructor(
    private readonly homogeneousGroupDAO: HomogeneousGroupDAO,
    private readonly hierarchyDAO: HierarchyDAO,
    private readonly examDAO: ExamDAO,
    private readonly documentVersionDAO: DocumentVersionDAO,
  ) {}

  async findDocumentPGR(params: IDocumentDAO.FindByIdParams) {
    const document = await this.documentVersionDAO.find({ id: params.documentVersionId });

    const workspaceId = document?.documentBase?.workspace.id;
    if (!workspaceId) return null;

    const [homogeneousGroups, hierarchies, exams] = await Promise.all([
      this.homogeneousGroupDAO.findMany({
        workspaceId,
        companyId: document.documentBase.company.id,
        homogeneousGroupsIds: params.homogeneousGroupsIds,
      }),
      this.hierarchyDAO.findMany({ workspaceId, homogeneousGroupsIds: params.homogeneousGroupsIds }),
      this.examDAO.findMany({ companyId: document.documentBase.company.id }),
    ]);

    const documentModel = new DocumentPGRModel({
      documentVersion: document,
      homogeneousGroups,
      exams,
      hierarchies,
      scopeOfSelectedGroupIds: params.homogeneousGroupsIds || [],
    });

    logPgrDiagnostic('pgr_model', {
      documentVersionId: params.documentVersionId,
      scopeOfSelectedGroupIdsCount: params.homogeneousGroupsIds?.length ?? 0,
      scopeOfSelectedGroupIds: params.homogeneousGroupsIds ?? [],
      homogeneousGroupsInModel: homogeneousGroups.length,
      hierarchiesInModel: hierarchies.length,
    });

    await this.applyEmissionDate(documentModel, params.documentDate);

    return documentModel;
  }

  private async applyEmissionDate(
    document: DocumentPGRModel,
    documentDateFromPayload?: string,
  ) {
    const parsed = parseDocumentEmissionDate(documentDateFromPayload);
    if (!parsed) return;

    const hadPersistedDate = !!document.documentVersion.documentDate;
    applyDocumentEmissionDateToPgrModel(document, parsed);

    if (!hadPersistedDate) {
      await this.documentVersionDAO.updateDocumentDate(
        document.documentVersion.id,
        parsed,
      );
    }
  }

  async findDocumentFRPS(params: IDocumentDAO.FindByIdParams) {
    const document = await this.findDocumentPGR(params);
    if (!document) return null;

    const homogeneousGroups = document.homogeneousGroups.map(
      (group) =>
        new HomogeneousGroupModel({
          id: group.id,
          name: group.name,
          description: group.description,
          type: group.type,
          companyId: group.companyId,
          hierarchies: group.hierarchies,
          characterization: group.characterization,
          risksData: group.allRiskData.filter((riskData) => isFrpsRisk(riskData.risk)),
          frpsOnly: true,
        }),
    );

    return new DocumentPGRModel({
      documentVersion: document.documentVersion,
      homogeneousGroups,
      exams: document.exams,
      hierarchies: document.hierarchies,
      scopeOfSelectedGroupIds: document.scopeOfSelectedGroupIds,
    });
  }
}
