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
import { ExposureEnumMap, getConcatRisksData } from './RiskStructureRsDataNR';
import { convertTitleUpload } from '../../helpers/convertTitleUpload';
import { CompanyStructRSDataACGHHeaderEnum as NR } from '../../../upload/products/CompanyStructure/constants/company-struct-rsdata-acgh.constants';
import { formatCNPJ, onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { IRiskDataJsonQui } from 'src/modules/company/interfaces/risk-data-json.types';
import { BadRequestException } from '@nestjs/common';
import { OtherAppendixEnum } from 'src/shared/constants/enum/appendix';
import { DownloadRiskStructureReportDto } from 'src/modules/files/dto/risk-structure-report.dto';

export class RiskStructureRsDataACGH extends ReportRiskStructureProduct {
  public sanitizeData(data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getPrgRiskData']>>, params: DownloadRiskStructureReportDto): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = []
    const errors: string[] = []

    Array.from(data.hierarchyData.values()).forEach((hierarchy) => {
      return this.getRiskDataByHierarchy({ hierarchy, riskData: getConcatRisksData(data) }).sort((a, b) => sortString(a.riskFactor.name, b.riskFactor.name)).map((riskData) => {
        if (riskData.riskFactor.representAll) return
        if (riskData.riskFactor.otherAppendix !== OtherAppendixEnum.ACGH) return
        const method = riskData.riskFactor.method
        const exposure = ExposureEnumMap[riskData.exposure]

        const startDate = riskData.startDate || params.startDate
        const eficientEpi = riskData.epiToRiskFactorData.some(epi => epi.efficientlyCheck)

        if (typeof exposure != 'number') {
          errors.push(`Exposição não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!startDate) {
          errors.push(`Início de exposição não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!method) {
          errors.push(`Técnica não informada para o risco ${riskData.riskFactor.name}`)
        }

        const engs = riskData.engs.map(gs => gs.medName).filter(Boolean).join('; ')
        const adms = riskData.adms.map(gs => gs.medName).filter(Boolean).join('; ')
        const recs = riskData.recs.map(gs => gs.recName).filter(Boolean).join('; ')
        const meds = [engs, adms].filter(Boolean).join('; ')
        const gs = riskData.generateSources.map(gs => gs.name).filter(Boolean).join('; ')

        const json = (riskData.json || {}) as unknown as IRiskDataJsonQui

        const sanitazeRow: IReportSanitizeData = {
          [NR.TIPO]: { content: 1 },
          [NR.CNPJ]: { content: formatCNPJ(onlyNumbers(data.company.cnpj)) },
          [NR.INICIO]: { content: startDate },
          [NR.FIM]: { content: riskData.endDate },
          [NR.TECNICA]: { content: method },
          [NR.EXPOSICAO]: { content: exposure },

          [NR.AGENTE]: { content: riskData.riskFactor.name },
          [NR.TWA]: { content: json.twa || '' },
          [NR.STEL]: { content: json.stel || '' },

          [NR.CONSIDERAR_PCMSO]: { content: 1 },
          [NR.NAO_CONSIDERAR_COMPLEMENTARES]: { content: 1 },
          [NR.CA]: { content: riskData.epis.map(epi => epi.ca).join('/') },
          [NR.FONTE_GERADORA]: { content: gs },
          [NR.MEDIDAS_CONTROLE]: { content: meds },
          [NR.RECOMENDACOES]: { content: recs },
          [NR.MEIO_PROP]: { content: riskData.riskFactor.propagation.join(', ') },
          [NR.COMPROMETIMENTO]: { content: riskData.riskFactor.risk },
          [NR.POSSIVEIS_DANOS]: { content: riskData.riskFactor.symptoms },

          //hierarchy
          ...hierarchy.org.reduce((acc, org) => {
            return {
              ...acc,
              [hierarchyMap[org.typeEnum].databaseRsData]: { content: org.name },
            };
          }, {}),
          //epi
          ...[NR.EPI, NR.EPI_EFETIVO, NR.TREINAMENTO, NR.REGISTRO, NR.EPI_ALL].reduce((acc, epi) => ({
            ...acc,
            [epi]: { content: eficientEpi ? 1 : 0 }
          }), {}),
        };

        rows.push(sanitazeRow);
        console.log(hierarchy.org.reduce((acc, org) => {
          return {
            ...acc,
            [hierarchyMap[org.typeEnum].databaseRsData]: { content: org.name },
          };
        }, {}))
      })
    })


    if (errors.length) {
      throw new BadRequestException(errors)
    }

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
