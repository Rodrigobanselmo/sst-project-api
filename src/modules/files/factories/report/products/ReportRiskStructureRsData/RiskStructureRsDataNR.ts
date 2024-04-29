import { DocumentPGRFactoryProduct } from '../../../../../documents/factories/document/products/PGR/DocumentPGRFactory';
import { AppendixEnumMap, Nr16AppendixEnumMap } from './../../../../../../shared/constants/enum/appendix';
import { IRiskDataActivities, QuantityTypeEnum } from './../../../../../company/interfaces/risk-data-json.types';
import { IHierarchyMap } from './../../../../../documents/docx/converter/hierarchy.converter';

import { formatCNPJ, onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { ExposureTypeEnum, HomoTypeEnum } from '@prisma/client';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';
import { DownloadRiskStructureReportDto } from 'src/modules/files/dto/risk-structure-report.dto';
import { RiskFactorDataEntity } from 'src/modules/sst/entities/riskData.entity';
import { originRiskMap } from 'src/shared/constants/maps/origin-risk';
import { isNaEpi, isNaRecMed } from 'src/shared/utils/isNa';
import { removeDuplicate } from 'src/shared/utils/removeDuplicate';
import { sortString } from 'src/shared/utils/sorts/string.sort';
import { PromiseInfer } from '../../../../../../shared/interfaces/promise-infer.types';
import { CompanyStructRSDataNRHeaderEnum as NR } from '../../../upload/products/CompanyStructure/constants/company-struct-rsdata-nr.constants';
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


export const ExposureEnumMap: Record<ExposureTypeEnum, number> = {
  [ExposureTypeEnum.HP]: 0,
  [ExposureTypeEnum.O]: 1,
  [ExposureTypeEnum.HI]: 2,
}

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
  addRow(anexo: string | number, accpet: (string | number)[], object: IReportSanitizeData) {
    if (accpet.includes(anexo)) {
      return object
    }

    return {}
  }

  private mapRadRiskAnexo7(risk: string) {
    const riskName = risk.toLocaleLowerCase()
    if (riskName.includes('ultrassom')) return 1
    if (riskName.includes('campos magnéticos estáticos')) return 2
    if (riskName.includes('campos magnéticos de sub-radiofrequência')) return 3
    if (riskName.includes('sub-radiofrequência')) return 4
    if (riskName.includes('radiação de radiofrequência')) return 5
    if (riskName.includes('micro-ondas')) return 6
    if (riskName.includes('radiação visível')) return 7
    if (riskName.includes('radiação ultravioleta, exceto')) return 8
    if (riskName.includes('radiação ultravioleta na faixa')) return 9
    if (riskName.includes('laser')) return 10
    return ''
  }

  public sanitizeData(data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getPrgRiskData']>>, params: DownloadRiskStructureReportDto): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = []
    const errors: string[] = []

    Array.from(data.hierarchyData.values()).map((hierarchy) => {
      return this.getRiskDataByHierarchy({ hierarchy, riskData: getConcatRisksData(data) }).sort((a, b) => sortString(a.riskFactor.name, b.riskFactor.name)).map((riskData) => {
        if (riskData.riskFactor.representAll) return

        const method = riskData.riskFactor.method
        const exposure = ExposureEnumMap[riskData.exposure]
        const appendix = AppendixEnumMap[riskData.riskFactor.getAnexo()]?.rsData
        const nr16appendix = Nr16AppendixEnumMap[riskData.riskFactor.getNr16Anexo()]?.rsData

        const startDate = riskData.startDate || params.startDate
        const roLevel = riskData.level
        const eficientEpi = riskData.epiToRiskFactorData.some(epi => epi.efficientlyCheck)
        const riskType = riskData.riskFactor.getRiskType();

        if (typeof exposure != 'number') {
          errors.push(`Exposição não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!startDate) {
          errors.push(`Início de exposição não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!method) {
          errors.push(`Técnica não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!nr16appendix || !appendix) {
          errors.push(`Anexo não informada para o risco ${riskData.riskFactor.name}`)
        }
        if (!roLevel) {
          errors.push(`Probabilidade ou Severidade não informada para o risco ${riskData.riskFactor.name}`)
        }

        const engs = riskData.engs.map(gs => gs.medName).join('; ')
        const adms = riskData.adms.map(gs => gs.medName).join('; ')
        const meds = [engs, adms].flat().join('; ')
        const activitiesJson = (riskData.activities as IRiskDataActivities)

        const rowsData: { value: string | number; activity: [string, string] }[] = []

        if (appendix == 13) {
          if (!activitiesJson.activities?.length) {
            errors.push(`Manipulação não informada para o risco ${riskData.riskFactor.name}`)
          }

          activitiesJson.activities.forEach(manipulation => {
            if (manipulation.description) rowsData.push({ value: appendix, activity: [manipulation.description, ''] })
          })
        } else if (!!appendix) {
          rowsData.push({ value: appendix, activity: ['', ''] })
        }

        activitiesJson?.activities?.forEach(activity => {
          if (activity.description) rowsData.push({ value: nr16appendix, activity: [activity.description, activity.subActivity] })
        })

        if (!rowsData?.length) {
          errors.push(`Atividade ou areá de risco não informada para o risco ${riskData.riskFactor.name}`)
        }

        rowsData.forEach(row => {
          const sanitazeRow: IReportSanitizeData = {
            [NR.TIPO]: { content: 1 },
            [NR.CNPJ]: { content: formatCNPJ(onlyNumbers(data.company.cnpj)) },
            [NR.INICIO]: { content: riskData.startDate },
            [NR.FIM]: { content: riskData.endDate },
            [NR.ANEXO]: { content: row.value },
            [NR.TECNICA]: { content: method },
            [NR.EXPOSICAO]: { content: exposure },
            [NR.CONSTAR_EM]: { content: 0 },
            [NR.CONSIDERAR_PCMSO]: { content: roLevel > 3 ? 1 : 0 },
            [NR.NAO_CONSIDERAR_COMPLEMENTARES]: { content: 1 },
            [NR.CA]: { content: riskData.epis.map(epi => epi.ca).join('/') },
            [NR.FONTE_GERADORA]: { content: riskData.generateSources.map(gs => gs.name).join('; ') },
            [NR.MEDIDAS_CONTROLE]: { content: meds },
            [NR.RECOMENDACOES]: { content: riskData.recs.map(gs => gs.recName).join('; ') },
            [NR.MEIO_PROP]: { content: riskData.riskFactor.propagation.join(', ') },
            [NR.COMPROMETIMENTO]: { content: riskData.riskFactor.risk },
            [NR.POSSIVEIS_DANOS]: { content: riskData.riskFactor.symptoms },
            [NR.OBSERVACOES]: { content: riskData.riskFactor.coments },
            ...this.addRow(row.value, [11, 13, 14], {
              [NR.VIAS_ABS]: { content: riskData.riskFactor.symptoms },
            }),
            ...this.addRow(row.value, [1], {
              [NR.MEDIÇAO_INSS]: { content: (riskData.json as any)?.nr15q5 },
              [NR.MEDIÇAO_PORTARIA]: { content: (riskData.json as any)?.ltcatq5 }, //! not sure
            }),
            ...this.addRow(row.value, [2], {
              [NR.MEDIÇAO_INSS]: { content: riskData?.intensity || '' },
              [NR.TIPO_LEITURA]: { content: 0 }, //! missing
            }),
            ...this.addRow(row.value, [3], {
              [NR.RESULTADO]: { content: (riskData.json as any)?.ibtug || '' },
              [NR.TIPO_ATIVIDADE]: { content: '' }, //! missing
              [NR.KCAL]: { content: '' }, //! missing
              [NR.REGIME]: { content: '' }, //! missing
              [NR.LOCAL]: { content: '' }, //! missing
              [NR.LIMITE_IBUTG]: { content: riskData?.ibtugLEO || '' },
            }),
            ...this.addRow(row.value, [5], {
              [NR.INTENSIDADE_RAD]: { content: riskData?.intensity || '' },
            }),
            ...this.addRow(row.value, [8], {
              [NR.TIPO_VIBRACAO]: { content: riskType === QuantityTypeEnum.VFB ? 3 : 0 },
              [NR.CORPO]: { content: '' }, //! missing
              [NR.INTENSIDADE_AREN]: { content: (riskData.json as any).aren || '' },
              [NR.INTENSIDADE_VDVR]: { content: (riskData.json as any).vdvr || '' },
            }),
            ...this.addRow(row.value, [9], {
              [NR.LIMITE_FRIO]: { content: '' }, //! missing
              [NR.INTENSIDADE_FRIO]: { content: '' }, //! missing
            }),
            ...this.addRow(row.value, [11], {
              [NR.AGENTE_QUI]: { content: riskData.riskFactor.name },
              [NR.INTENSIDADE_QUI]: { content: (riskData.json as any).nr15ltValue || (riskData.json as any).stelValue || '' },
              [NR.UNIDADE]: { content: (riskData.json as any).unit || '' },
            }),
            ...this.addRow(row.value, [12], {
              [NR.AGENTE_POEIRA]: { content: riskData.riskFactor.name },
              [NR.INTENSIDADE_POEIRA]: { content: (riskData.json as any).nr15ltValue || (riskData.json as any).stelValue || '' },
              [NR.UNIDADE_POEIRA]: { content: (riskData.json as any).unit || '' },
            }),
            ...this.addRow(row.value, [13], {
              [NR.AGENTE_POEIRA]: { content: riskData.riskFactor.name },
              [NR.MANIPULAÇAO_ANEXO_13]: { content: row.activity[0] || '' },
            }),
            ...this.addRow(row.value, [7], {
              [NR.AGENTE_RESTO]: { content: this.mapRadRiskAnexo7(riskData.riskFactor.name) },
            }),
            ...this.addRow(row.value, [15, 16, 17, 19], {
              [NR.AGENTE_RESTO]: { content: row.activity[0] },
            }),
            ...this.addRow(row.value, [14, 'A', 'E'], {
              [NR.AGENTE_RESTO]: { content: riskData.riskFactor.name },
            }),
            ...this.addRow(row.value, [18, 20], {
              [NR.FATOR_ELET_RAD]: { content: row.activity[0] },
              [NR.TAREFA_ELET_RAD]: { content: row.activity[1] },
            }),
            ...this.addRow(row.value, ['N'], {
              [NR.AGENTE_EQUIVALENTE]: { content: riskData.riskFactor.name },
            }),



            //hierarchy
            ...hierarchy.org.reduce((acc, org) => {
              return {
                ...acc,
                [hierarchyMap[org.typeEnum].databaseRsData]: { content: org.name },
              };
            }, {}),
            //epi
            ...[NR.EPI_EFICAZ, NR.EPI_REGISTRO, NR.EPI_TREINAMENTO, NR.EPI_1, NR.EPI_2, NR.EPI_3, NR.EPI_4, NR.EPI_5, NR.EPI_6, NR.EPI_7].reduce((acc, epi) => ({
              ...acc,
              [epi]: { content: eficientEpi ? 1 : 0 }
            }), {}),
          };

          rows.push(sanitazeRow);
        });

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
