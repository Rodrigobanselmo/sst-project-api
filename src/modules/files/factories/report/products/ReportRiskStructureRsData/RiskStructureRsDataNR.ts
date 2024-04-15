import { DocumentPGRFactoryProduct } from '../../../../../documents/factories/document/products/PGR/DocumentPGRFactory';
import { IHierarchyMap } from './../../../../../documents/docx/converter/hierarchy.converter';

import { HomoTypeEnum } from '@prisma/client';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';
import { RiskFactorDataEntity } from 'src/modules/sst/entities/riskData.entity';
import { originRiskMap } from 'src/shared/constants/maps/origin-risk';
import { isNaEpi, isNaRecMed } from 'src/shared/utils/isNa';
import { removeDuplicate } from 'src/shared/utils/removeDuplicate';
import { sortString } from 'src/shared/utils/sorts/string.sort';
import { PromiseInfer } from '../../../../../../shared/interfaces/promise-infer.types';
import { CompanyStructRSDataNRColumnList } from '../../../upload/products/CompanyStructure/constants/headersList/CompanyStructRSDataNRColumnList';
import { hierarchyMap } from '../../../upload/products/CompanyStructure/maps/hierarchyMap';
import { convertHeaderUpload } from '../../helpers/convertHeaderUpload';
import { convertTitleUpload } from '../../helpers/convertTitleUpload';
import { getCompanyInfo } from '../../helpers/getCompanyInfo';
import {
  IReportCell,
  IReportHeader,
  IReportSanitizeData
} from '../../types/IReportFactory.types';
import { ReportRiskStructureProduct } from '../ReportRiskStructureFactory';
import { CompanyStructRSDataNRHeaderEnum as NR } from '../../../upload/products/CompanyStructure/constants/company-struct-rsdata-nr.constants';
import { formatCNPJ, onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { BadRequestException } from '@nestjs/common';
import { DownloadRiskStructureReportDto } from 'src/modules/files/dto/risk-structure-report.dto';

export function setPriorizationRiskData(riskData: Partial<RiskFactorDataEntity>, hierarchyTree: IHierarchyMap) {
  const isHierarchy = riskData.homogeneousGroup.type == HomoTypeEnum.HIERARCHY
  const isEpcEfficienty = riskData.engsToRiskFactorData.some(eng => eng.efficientlyCheck)
  const isEpiEfficienty = riskData.epiToRiskFactorData.some(epi => epi.efficientlyCheck)

  const isEfficienty = isEpcEfficienty || isEpiEfficienty
  const ifIsEfficientShouldGetOther = isEfficienty ? 0.5 : 0
  const ifProbabilityIsHighePrior = (10 - (riskData.probability || 0)) / 100

  if (!isHierarchy) return riskData.prioritization = 3 + ifIsEfficientShouldGetOther + ifProbabilityIsHighePrior

  const hierarchy = hierarchyTree[riskData.homogeneousGroup.id]
  const prioritization = originRiskMap[hierarchy.type]?.prioritization;
  return riskData.prioritization = prioritization + ifIsEfficientShouldGetOther + ifProbabilityIsHighePrior

}

export function getConcatRisksData(data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getPrgRiskData']>>) {
  const map: Record<string, Partial<RiskFactorDataEntity>> = {};

  data.riskGroupData?.data?.forEach((riskData) => {
    setPriorizationRiskData(riskData, data.hierarchyTree)

    console.log(riskData.riskFactor.name, riskData.prioritization)


    const riskId = riskData.riskId
    if (!map[riskId]) {
      map[riskId] = riskData;
    }

    map[riskId].generateSources = removeDuplicate([...map[riskId].generateSources, ...riskData.generateSources], { removeById: 'id' })
    map[riskId].recs = removeDuplicate([...map[riskId].recs, ...riskData.recs], { removeById: 'id' })
    map[riskId].engs = removeDuplicate([...map[riskId].engs, ...riskData.engs], { removeById: 'id' }).filter((e) => !isNaRecMed(e.medName))
    map[riskId].adms = removeDuplicate([...map[riskId].adms, ...riskData.adms], { removeById: 'id' }).filter((e) => !isNaRecMed(e.medName))
    map[riskId].epis = removeDuplicate([...map[riskId].epis, ...riskData.epis], { removeById: 'id' }).filter((e) => !isNaEpi(e.ca))

    const takeThisIfPrior = riskData.prioritization < map[riskId].prioritization

    if (takeThisIfPrior) {
      map[riskId] = {
        ...riskData,
        generateSources: map[riskId].generateSources,
        recs: map[riskId].recs,
        engs: map[riskId].engs,
        adms: map[riskId].adms,
        epis: map[riskId].epis,
      }
    }
  })

  return Object.values(map)
}


export class RiskStructureRsDataNR extends ReportRiskStructureProduct {
  // constructor(private readonly _documentPGRFactory: DocumentPGRFactory, private readonly _companyRepository: CompanyRepository) {
  //   super(_documentPGRFactory, _companyRepository)
  // }

  public sanitizeData(data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getPrgRiskData']>>, params: DownloadRiskStructureReportDto): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = []
    const errors: string[] = []

    Array.from(data.hierarchyData.values()).map((hierarchy) => {
      return this.getRiskDataByHierarchy({ hierarchy, riskData: getConcatRisksData(data) }).sort((a, b) => sortString(a.riskFactor.name, b.riskFactor.name)).map((riskData) => {
        const isQuimical = riskData.riskFactor.type === 'QUI';
        const method = riskData.riskFactor.method
        const exposure = riskData.exposure
        const startDate = riskData.startDate || params.startDate

        if (!exposure) {
          errors.push(`Exposição não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!startDate) {
          errors.push(`Início de exposição não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!method) {
          errors.push(`Técnica não informada para o risco ${riskData.riskFactor.name}`)
        }

        const sanitazeRow: IReportSanitizeData = {
          [NR.TIPO]: { content: 1 },
          [NR.CNPJ]: { content: formatCNPJ(onlyNumbers(data.company.cnpj)) },
          [NR.INICIO]: { content: riskData.startDate },
          [NR.FIM]: { content: riskData.endDate },
          [NR.TECNICA]: { content: method },
          [NR.EXPOSICAO]: { content: exposure || '' },
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
          //hierarchy
          ...hierarchy.org.reduce((acc, org) => {
            return {
              ...acc,
              [hierarchyMap[org.typeEnum].databaseRsData]: { content: org.name },
            };
          }, {}),
          //epi
          ...(riskData.epiToRiskFactorData.some(epi => epi.efficientlyCheck) && {
            ...['epiEfficiently', 'epiEpc', 'epiLongPeriods', 'epiValidation', 'epiTradeSign', 'epiSanitation', 'epiMaintenance', 'epiUnstopped', 'epiTraining'].reduce((acc, epi) => ({
              ...acc,
              [epi]: { content: 'Sim' }
            }), {})
          }),
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
    const name = `NR15; NR16`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header: IReportHeader = convertHeaderUpload(CompanyStructRSDataNRColumnList);

    return header
  }

  public getTitle(_: IReportHeader, company: CompanyEntity): IReportCell[][] {
    const { main } = getCompanyInfo(company);
    const version: IReportCell[] = [{ content: 'Versão', font: { size: 12, bold: true, color: { theme: 1 }, name: 'Calibri' } }, { content: '2023.1', font: { size: 12, bold: true, color: { theme: 1 }, name: 'Calibri' } }];
    const versionValue: IReportCell[] = [{ content: 1, font: { size: 12, bold: true, color: { theme: 1 }, name: 'Calibri' } }];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle = convertTitleUpload(CompanyStructRSDataNRColumnList);


    const rows: IReportCell[][] = [main[0], version, emptyRow, versionValue, emptyRow, emptyRow, emptyRow, headerTitle];
    return rows;
  }

  public getEndInformation(): IReportCell[][] {
    const rows = [];

    return rows;
  }
}
