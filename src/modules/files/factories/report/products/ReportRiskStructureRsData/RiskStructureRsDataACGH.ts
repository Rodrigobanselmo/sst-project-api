import { DocumentPGRFactoryProduct } from '../../../../../documents/factories/document/products/PGR/DocumentPGRFactory';

import { sortString } from 'src/shared/utils/sorts/string.sort';
import { PromiseInfer } from '../../../../../../shared/interfaces/promise-infer.types';
import { CompanyStructRSDataACGHColumnList } from '../../../upload/products/CompanyStructure/constants/headersList/CompanyStructRSDataACGHColumnList';
import { hierarchyMap } from '../../../upload/products/CompanyStructure/maps/hierarchyMap';
import { convertHeaderUpload } from '../../helpers/convertHeaderUpload';
import {
  IReportCell,
  IReportHeader,
  IReportSanitizeData
} from '../../types/IReportFactory.types';
import { ReportRiskStructureProduct } from '../ReportRiskStructureFactory';
import { getConcatRisksData } from './RiskStructureRsDataNR';
import { convertTitleUpload } from '../../helpers/convertTitleUpload';

export class RiskStructureRsDataACGH extends ReportRiskStructureProduct {
  public sanitizeData(data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getPrgRiskData']>>): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = []

    Array.from(data.hierarchyData.values()).map((hierarchy) => {
      return this.getRiskDataByHierarchy({ hierarchy, riskData: getConcatRisksData(data) }).sort((a, b) => sortString(a.riskFactor.name, b.riskFactor.name)).map((riskData) => {
        const isQuimical = riskData.riskFactor.type === 'QUI';

        const sanitazeRow: IReportSanitizeData = {
          startDate: { content: riskData.startDate },
          endDate: { content: riskData.endDate },
          workspace: { content: data.workspace.name },
          officeDescription: { content: hierarchy.descRh },
          officeRealDescription: { content: hierarchy.descReal },
          risk: { content: riskData.riskFactor.name },
          probability: { content: riskData.probability },
          probabilityAfter: { content: riskData.probabilityAfter },
          generateSources: { content: this.joinArray(riskData.generateSources.map(gs => gs.name)) },
          ...(isQuimical && {
            unit: isQuimical ? { content: Object(riskData?.json)?.unit || riskData.riskFactor.unit } : undefined,
          }),
          rec: { content: this.joinArray(riskData.recs.map(rec => rec.recName)) },
          epc: { content: this.joinArray(riskData.engs.map(eng => eng.medName)) },
          ...(riskData.engsToRiskFactorData.some(eng => eng.efficientlyCheck) && {
            epcEfficiently: { content: 'Sim' },
          }),
          adm: { content: this.joinArray(riskData.adms.map(adm => adm.medName)) },
          epiCa: { content: this.joinArray(riskData.epis.map(epi => epi.ca)) },
          //epi
          ...(riskData.epiToRiskFactorData.some(epi => epi.efficientlyCheck) && {
            ...['epiEfficiently', 'epiEpc', 'epiLongPeriods', 'epiValidation', 'epiTradeSign', 'epiSanitation', 'epiMaintenance', 'epiUnstopped', 'epiTraining'].reduce((acc, epi) => ({
              ...acc,
              [epi]: { content: 'Sim' }
            }), {})
          }),
          //hierarchy
          ...hierarchy.org.reduce((acc, org) => {
            return {
              ...acc,
              [hierarchyMap[org.typeEnum].database]: { content: org.name },
            };
          }, {}),
          //risk json info
          ...Object.keys(Object(riskData.json)).reduce((acc, key) => ({
            ...acc,
            ...(key != 'unit' && {
              [key]: { content: this.normalizeContent(riskData.json[key]) },
            })
          }), {}),
        };

        rows.push(sanitazeRow);
      })
    }).flat();

    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Fatores de risco para RSData ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `ACGH`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header: IReportHeader = convertHeaderUpload(CompanyStructRSDataACGHColumnList);

    return header
  }

  public getTitle(): IReportCell[][] {
    const headerTitle = convertTitleUpload(CompanyStructRSDataACGHColumnList);

    const rows: IReportCell[][] = [headerTitle];
    return rows;
  }

}
