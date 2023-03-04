import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';

import { documentElementTypeMap } from './../../../constants/documentElementType.constant';
import { documentSectionTypeMap } from './../../../constants/documentSectionType.constant';
import { variableMap } from './../../../constants/variables.constant';
import { IGetDocumentModelData } from './../../../dto/document-model.dto';
import { DocumentModelRepository } from './../../../repositories/implementations/DocumentModelRepository';

@Injectable()
export class GetDocVariablesService {
  constructor(private readonly documentModelRepository: DocumentModelRepository) {}

  async execute(id: number, query: IGetDocumentModelData) {
    const model = await this.document(id, query.companyId);
    const documentData = this.getDocumentData(['OTHER', model.type]);

    return {
      document: model.dataJson,
      variables: documentData.variables,
      elements: documentData.elements,
      sections: documentData.sections,
    };
  }
  private filterMap(map: Record<any, any>, includes: DocumentTypeEnum) {
    return Object.entries(map)
      .filter(([, value]) => value.active !== false && value.accept.includes(includes))
      .reduce((acc, curr) => {
        acc[curr[0]] = curr[1];
        return acc;
      }, {});
  }

  private getDocumentData(includes: DocumentTypeEnum[]) {
    return includes.reduce(
      (acc, type) => {
        const variables = this.filterMap(variableMap, type);
        const elements = this.filterMap(documentElementTypeMap, type);
        const sections = this.filterMap(documentSectionTypeMap, type);

        return { variables: { ...acc.variables, ...variables }, sections: { ...acc.sections, ...sections }, elements: { ...acc.elements, ...elements } };
      },
      { variables: {}, elements: {}, sections: {} },
    );
  }

  private async document(id: number, companyId: string) {
    const doc = await this.documentModelRepository.find(
      { id: [id], companyId, all: true, showInactive: true },
      { skip: 0, take: 1 },
      { select: { data: true, type: true } },
    );

    const docData = doc.data?.[0]?.dataJson;
    if (!docData) throw new BadRequestException('Modelo não encontrado');

    return doc.data?.[0];
  }
}
