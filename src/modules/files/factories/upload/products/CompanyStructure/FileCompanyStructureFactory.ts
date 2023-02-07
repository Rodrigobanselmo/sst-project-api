import { UploadRiskStructureReportDto } from './../../../../dto/risk-structure-report.dto';
import { HierarchyEntity } from './../../../../../company/entities/hierarchy.entity';
import { RiskRepository } from './../../../../../sst/repositories/implementations/RiskRepository';
import { HierarchyExcelProvider } from './../../../../providers/HierarchyExcelProvider';
import { CreateGenerateSourceService } from './../../../../../sst/services/generate-source/create-generate-source/create-generate-source.service';
import { CreateRecMedService } from './../../../../../sst/services/rec-med/create-rec-med/create-rec-med.service';
import { QuantityTypeEnum } from './../../../../../company/interfaces/risk-data-json.types';
import { isRiskQuantity } from './../../../../../../shared/utils/isRiskQuantity';
import { RiskFactorsEntity } from './../../../../../sst/entities/risk.entity';
import { FindAllAvailableRiskService } from './../../../../../sst/services/risk/find-all-available-risk/find-all-available-risk.service';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { asyncBatch } from '../../../../../../shared/utils/asyncBatch';
import { UpsertRiskDataService } from './../../../../../sst/services/risk-data/upsert-risk-data/upsert-risk.service';
import { PrismaService } from './../../../../../../prisma/prisma.service';
import { IExcelReadData } from './../../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsNumber } from './../../../../../../shared/utils/validators/checkIdNumber';
import { checkIsString } from './../../../../../../shared/utils/validators/checkIsString';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { ExcelProvider } from '../../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { FindCompaniesDto } from '../../../../../company/dto/company.dto';
import { FileFactoryAbstractionCreator } from '../../creator/FileFactoryCreator';
import { IColumnRuleMap, IFileFactoryProduct, ISheetData, ISheetExtractedData } from '../../types/IFileFactory.types';
import { CompanyStructColumnMap, CompanyStructHeaderEnum, emptyHierarchy } from './constants/company-struct.constants';
import { IEpiReturn, IHierarchyDataReturn, IHomoDataReturn, IMapData, IWorkDataReturn, IWorkspaceData } from './types/company-struct.constants';
import { HierarchyEnum, Workspace, HomogeneousGroup } from '@prisma/client';
import { FileHelperProvider } from '../../../../providers/FileHelperProvider';
import { hierarchyList } from '../../../../../../shared/constants/lists/hierarchy.list';
import { EpiRoRiskDataDto } from '../../../../../../modules/sst/dto/epi-risk-data.dto';

@Injectable()
export class FileCompanyStructureFactory extends FileFactoryAbstractionCreator<UploadRiskStructureReportDto, CompanyStructHeaderEnum> {
  constructor(
    private readonly excelProv: ExcelProvider,
    private readonly prisma: PrismaService,
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly riskRepository: RiskRepository,
    private readonly createRecMedService: CreateRecMedService,
    private readonly createGenerateSourceService: CreateGenerateSourceService,
    private readonly hierarchyExcelProvider: HierarchyExcelProvider,
    private readonly fileHelperProvider: FileHelperProvider,
  ) {
    super(excelProv, prisma);
  }

  public factoryMethod(): IFileFactoryProduct {
    return new FileFactoryProduct(
      this.prisma,
      this.upsertRiskDataService,
      this.riskRepository,
      this.createRecMedService,
      this.createGenerateSourceService,
      this.hierarchyExcelProvider,
      this.fileHelperProvider,
    );
  }
}

class FileFactoryProduct implements IFileFactoryProduct {
  public splitter = '; ';

  constructor(
    private readonly prisma: PrismaService,
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly riskRepository: RiskRepository,
    private readonly createRecMedService: CreateRecMedService,
    private readonly createGenerateSourceService: CreateGenerateSourceService,
    private readonly hierarchyExcelProvider: HierarchyExcelProvider,
    private readonly fileHelperProvider: FileHelperProvider,
  ) {
    //
  }

  public async getSheets(readFileData: IExcelReadData[]) {
    const columnsMap = await this.getColumns();

    const sheets: ISheetData[] = readFileData
      .map((sheet) => {
        return { sheetName: sheet.name, rows: sheet.data, columnsMap };
      })
      .slice(0, 1);

    return sheets;
  }

  public getHierarchyPath(data: Record<string, string>) {
    const hierarchyArray = hierarchyList.map((key) => (data[CompanyStructHeaderEnum[key]] as string) || emptyHierarchy);

    return hierarchyArray;
  }

  public async saveData(sheetsData: ISheetExtractedData<CompanyStructHeaderEnum>[], body: UploadRiskStructureReportDto) {
    const sheetData = sheetsData[0];
    const companyId = body.companyId;

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        riskFactorGroupData: { select: { id: true } },
        workspace: { where: { status: 'ACTIVE' }, select: { id: true, name: true, abbreviation: true } },
      },
    });

    const mapData = this.getMapData(sheetData);
    const mapDataWithId = await this.getMapDataWithId(company, mapData);

    return mapDataWithId;

    if (!company.riskFactorGroupData[0].id) throw new BadRequestException(`Sistema de gestão não cadatsrado`);

    return await asyncBatch(sheetData, 20, async (row) => {
      const json = this.getRiskDataJson(mapDataWithId.risk[row[CompanyStructHeaderEnum.RISK]].data, row);
      const episMap = mapDataWithId.epis;
      const riskMap = mapDataWithId.risk[row[CompanyStructHeaderEnum.RISK]];
      const workspaceMap = mapDataWithId.workspace[row[CompanyStructHeaderEnum.WORKSPACE]];

      const adms = row[CompanyStructHeaderEnum.EPC_OTHERS]?.map((admName: string) => riskMap.adms[admName].id);
      const engs = row[CompanyStructHeaderEnum.EPC]?.map((engName: string) => ({ recMedId: riskMap.engs[engName].id }));
      const generateSources = row[CompanyStructHeaderEnum.GENERATE_SOURCE]?.map((gs: string) => riskMap.generateSource[gs].id);
      const recs = row[CompanyStructHeaderEnum.REC]?.map((recName: string) => riskMap.recs[recName].id);
      const epis = row[CompanyStructHeaderEnum.EPI_CA]?.map(
        (ca: string) =>
          ({
            epiId: episMap[ca].id,
            efficientlyCheck: row[CompanyStructHeaderEnum.EPI_EFFICIENTLY],
            epcCheck: row[CompanyStructHeaderEnum.EPI_EPC],
            longPeriodsCheck: row[CompanyStructHeaderEnum.EPI_LONG_PERIODS],
            maintenanceCheck: row[CompanyStructHeaderEnum.EPI_MAINTENANCE],
            sanitationCheck: row[CompanyStructHeaderEnum.EPI_SANITATION],
            tradeSignCheck: row[CompanyStructHeaderEnum.EPI_TRADE_SIGN],
            trainingCheck: row[CompanyStructHeaderEnum.EPI_TRAINING],
            unstoppedCheck: row[CompanyStructHeaderEnum.EPI_UNSTOPPED],
            validationCheck: row[CompanyStructHeaderEnum.EPI_VALIDATION],
          } as EpiRoRiskDataDto),
      );

      const hierarchyPath = this.getHierarchyPath(row).join('--');
      const homogeneousGroupId = workspaceMap.homogeneousGroup[row[CompanyStructHeaderEnum.GHO]]?.id as string;

      await this.upsertRiskDataService.execute({
        companyId,
        homogeneousGroupId,
        ...(!homogeneousGroupId && { hierarchyId: workspaceMap.hierarchies[hierarchyPath]?.id as string }),
        riskFactorGroupDataId: company.riskFactorGroupData[0]?.id,
        adms,
        engs,
        recs,
        epis,
        generateSources,
        keepEmpty: true,
        riskId: riskMap?.id as string,
        probability: row[CompanyStructHeaderEnum.PROB],
        probabilityAfter: row[CompanyStructHeaderEnum.PROB_REC],
        endDate: row[CompanyStructHeaderEnum.END_DATE],
        startDate: row[CompanyStructHeaderEnum.START_DATE],
        ...(json && { json }),
      });
    });
  }

  private getRiskDataJson(risk: RiskFactorsEntity, data: Record<Partial<CompanyStructHeaderEnum>, any>) {
    const type = isRiskQuantity(risk);
    if (!type) return null;
    let submit = null;

    if (type == QuantityTypeEnum.QUI)
      submit = {
        stelValue: data[CompanyStructHeaderEnum.STEL] || '',
        twaValue: data[CompanyStructHeaderEnum.TWA_ACGH] || '',
        nr15ltValue: data[CompanyStructHeaderEnum.NR15LT] || '',
        vmpValue: data[CompanyStructHeaderEnum.VMP] || '',
        stel: risk.stel || '',
        twa: risk.twa || '',
        nr15lt: risk.nr15lt || '',
        vmp: risk.vmp || '',
        type: QuantityTypeEnum.QUI,
        unit: data[CompanyStructHeaderEnum.UNIT] || undefined,
      };

    if (type == QuantityTypeEnum.NOISE)
      submit = {
        ltcatq5: data[CompanyStructHeaderEnum.DBA_LTCAT_Q5] || '',
        ltcatq3: data[CompanyStructHeaderEnum.DBA_LTCAT_Q3] || '',
        nr15q5: data[CompanyStructHeaderEnum.DBA_NR15_Q5] || '',
        type: QuantityTypeEnum.NOISE,
      };

    if (type == QuantityTypeEnum.HEAT) {
      submit = {
        ibtug: data[CompanyStructHeaderEnum.IBTUG] || '',
        mw: data[CompanyStructHeaderEnum.MW] || '',
        isAcclimatized: data[CompanyStructHeaderEnum.IS_ACCLIMATIZED] || '',
        clothesType: data[CompanyStructHeaderEnum.CLOTHES_TYPE] || '',
        type: QuantityTypeEnum.HEAT,
      };
    }

    if (type == QuantityTypeEnum.VFB)
      submit = {
        aren: data[CompanyStructHeaderEnum.AREN] || '',
        vdvr: data[CompanyStructHeaderEnum.VDVR] || '',
        type: QuantityTypeEnum.VFB,
      };

    if (type == QuantityTypeEnum.VL)
      submit = {
        aren: data[CompanyStructHeaderEnum.AREN] || '',
        type: QuantityTypeEnum.VL,
      };

    return submit;
  }

  private getMapData(sheetData: ISheetExtractedData<CompanyStructHeaderEnum>) {
    const mapData: IMapData = {
      workspace: {},
      risk: {},
      epis: {},
    };

    sheetData.forEach((row) => {
      if (!mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]])
        mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]] = {
          value: row[CompanyStructHeaderEnum.WORKSPACE],
          hierarchies: {},
          homogeneousGroup: {},
          // characterization: {},
        };

      const hierarchyArray = this.getHierarchyPath(row);

      const isHierarchy = !!hierarchyArray.find((i) => i != emptyHierarchy);
      const isHomogeneousGroup = row[CompanyStructHeaderEnum.GHO];
      const isRisk = !!row[CompanyStructHeaderEnum.RISK];

      if (isHomogeneousGroup) {
        mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].homogeneousGroup[row[CompanyStructHeaderEnum.GHO]] = { value: row[CompanyStructHeaderEnum.GHO] };
      }

      if (isHierarchy) {
        mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].hierarchies[hierarchyArray.join('--')] = { value: hierarchyArray.join('--') };
      }

      if (!isHierarchy && !isHomogeneousGroup) throw new BadRequestException(`Informe ao menos um Setor, Cargo ou Grupo homogênio (Obrigatório)`);

      if (isRisk) {
        if (!mapData.risk[row[CompanyStructHeaderEnum.RISK]])
          mapData.risk[row[CompanyStructHeaderEnum.RISK]] = {
            value: row[CompanyStructHeaderEnum.RISK],
            generateSource: {},
            engs: {},
            adms: {},
            recs: {},
            data: {} as any,
          };

        const isGenerateSource = !!row[CompanyStructHeaderEnum.GENERATE_SOURCE];
        const isEngs = !!row[CompanyStructHeaderEnum.EPC];
        const isAdm = !!row[CompanyStructHeaderEnum.EPC_OTHERS];
        const isRec = !!row[CompanyStructHeaderEnum.REC];

        if (isGenerateSource) {
          row[CompanyStructHeaderEnum.GENERATE_SOURCE].map((value: string) => {
            mapData.risk[row[CompanyStructHeaderEnum.RISK]].generateSource[value] = {
              value,
            };
          });
        }

        if (isEngs) {
          row[CompanyStructHeaderEnum.EPC].map((value: string) => {
            mapData.risk[row[CompanyStructHeaderEnum.RISK]].engs[value] = {
              value,
            };
          });
        }

        if (isAdm) {
          row[CompanyStructHeaderEnum.EPC_OTHERS].map((value: string) => {
            mapData.risk[row[CompanyStructHeaderEnum.RISK]].adms[value] = {
              value,
            };
          });
        }

        if (isRec) {
          row[CompanyStructHeaderEnum.REC].map((value: string) => {
            mapData.risk[row[CompanyStructHeaderEnum.RISK]].recs[value] = {
              value,
            };
          });
        }

        const isEpi = !!row[CompanyStructHeaderEnum.EPI_CA];

        if (isEpi) {
          row[CompanyStructHeaderEnum.EPI_CA].map((value: string) => {
            mapData.epis[value] = {
              value,
            };
          });
        }
      }
    });

    return mapData;
  }

  private async getDatabaseMaps(
    company: {
      id: string;
      workspace: {
        id: string;
        name: string;
        abbreviation: string;
      }[];
    },
    mapData: IMapData,
    options?: { createHierarchy?: boolean; createHomo?: boolean },
  ) {
    const workspaces = company.workspace;
    const companyId = company.id;

    const episKeys = Object.keys(mapData.epis);
    const homoGroupsKeys = Object.keys(workspaces.map((w) => (mapData.workspace[w.name] || mapData.workspace[w.abbreviation])?.homogeneousGroup).flat(1));
    const hierarchyKeys = Object.keys(workspaces.map((w) => (mapData.workspace[w.name] || mapData.workspace[w.abbreviation])?.hierarchies).flat(1));
    const riskKeys = Object.keys(mapData.risk);

    const episPromise = this.prisma.epi.findMany({ where: { ca: { in: episKeys } }, select: { id: true, ca: true } });
    const homoGroupsPromise = this.prisma.homogeneousGroup.findMany({ where: { companyId, status: 'ACTIVE' }, select: { name: true, id: true } }); //! should be by workspace
    const hierarchiesPromise = this.prisma.hierarchy.findMany({
      where: { companyId, status: 'ACTIVE' },
      select: { id: true, name: true, parentId: true, type: true, workspaces: { select: { id: true } } },
    });

    const riskPromise = this.riskRepository.findAllAvailable(companyId, {
      where: { name: { in: Object.keys(mapData.risk) } },
      select: { id: true, name: true, esocialCode: true, type: true },
    });

    const [epis, homoGroups, hierarchies, risk] = await Promise.all([
      episKeys ? episPromise : [],
      homoGroupsKeys ? homoGroupsPromise : [],
      hierarchyKeys ? hierarchiesPromise : [],
      riskKeys ? riskPromise : [],
    ]);

    const homoGroupsMap: Record<string, IHomoDataReturn> = {}; //! should be by workspace
    const hierarchyMap: Record<string, IHierarchyDataReturn> = {};
    const riskMap: Record<string, RiskFactorsEntity> = {};
    const workspaceMap: Record<string, IWorkDataReturn> = {};
    const episMap: Record<string, IEpiReturn> = {};

    const hierarchyPathMap: Record<string, IHierarchyDataReturn> = {};

    epis?.forEach((epi) => {
      episMap[epi.ca] = epi;
    });

    homoGroups?.forEach((homo) => {
      homoGroupsMap[homo.name] = homo;
    });

    risk?.forEach((risk) => {
      riskMap[risk.name] = risk;
    });

    workspaces?.forEach((w) => {
      workspaceMap[w.name] = w;
      workspaceMap[w.abbreviation] = w;
    });

    hierarchies?.forEach((h) => {
      hierarchyMap[h.id] = h;
    });

    const setHierarchyArray = (hier: IHierarchyDataReturn, path: string[]) => {
      let arrayCopy = [...path];

      if (hier?.parentId) {
        const parent = hierarchyMap[hier.parentId];
        arrayCopy = setHierarchyArray(parent, arrayCopy);
      }

      if (hier.type == 'DIRECTORY') arrayCopy[1] = hier.name;
      if (hier.type == 'MANAGEMENT') arrayCopy[2] = hier.name;
      if (hier.type == 'SECTOR') arrayCopy[3] = hier.name;
      if (hier.type == 'SUB_SECTOR') arrayCopy[4] = hier.name;
      if (hier.type == 'OFFICE') arrayCopy[5] = hier.name;
      if (hier.type == 'SUB_OFFICE') arrayCopy[6] = hier.name;

      return arrayCopy;
    };

    hierarchyList.forEach((type) => {
      hierarchies.forEach((hier) => {
        if (hier.type != type) return;
        hier.workspaces.map(({ id }) => {
          const array = [id, emptyHierarchy, emptyHierarchy, emptyHierarchy, emptyHierarchy, emptyHierarchy, emptyHierarchy];
          const path = setHierarchyArray(hier, array);

          hierarchyPathMap[path.join('--')] = hier;
        });
      });
    });

    return { homoGroupsMap, hierarchyPathMap, hierarchyMap, riskMap, workspaceMap, episMap, company };
  }

  private async getMapDataWithId(
    company: {
      id: string;
      workspace: {
        id: string;
        name: string;
        abbreviation: string;
      }[];
    },
    mapData: IMapData,
  ) {
    const companyId = company.id;
    const { homoGroupsMap, riskMap, workspaceMap, hierarchyPathMap, episMap } = await this.getDatabaseMaps(company, mapData);

    Object.entries(mapData.epis).map(([ca]) => {
      const epiId = episMap[ca]?.id;
      if (!epiId) throw new BadRequestException(`Epi de ca: ${ca} não encontrado`);

      mapData.epis[ca].id = epiId;
    });

    Object.entries(mapData.workspace).map(([workspaceName, workspaceValue]) => {
      const workspaceId = workspaceMap[workspaceName]?.id;
      if (!workspaceId) throw new BadRequestException(`Estabelecimento ${workspaceName} não encontrado`);

      mapData.workspace[workspaceName].id = workspaceId;

      Object.keys(workspaceValue.homogeneousGroup).map((homoName) => {
        const homogeneousGroup = homoGroupsMap[homoName]?.id;
        if (!homogeneousGroup) throw new BadRequestException(`Grupo homogênio ${homoName} não encontrado`);

        mapData.workspace[workspaceName].homogeneousGroup[homoName].id = homogeneousGroup;
      });

      Object.keys(workspaceValue.hierarchies).map((hierarchyPath) => {
        const fullPath = workspaceId + '--' + hierarchyPath;

        const hierarchyFullPath = hierarchyPathMap[fullPath];
        if (!hierarchyFullPath)
          throw new BadRequestException(
            `Departamento ${hierarchyPath
              .split('--')
              .filter((v) => v != emptyHierarchy)
              .join(' --> ')} não encontrado`,
          );

        mapData.workspace[workspaceName].hierarchies[hierarchyPath].id = hierarchyFullPath.id;
      });
    });

    const promises = Object.entries(mapData.risk)
      .map(([riskName, riskValue]) => {
        const risk = riskMap[riskName];
        if (!risk) throw new BadRequestException(`Risco ${riskName} não encontrado`);

        mapData.risk[riskName].id = risk.id;
        mapData.risk[riskName].data = risk;

        const generateSourcePromises = Object.keys(riskValue.generateSource).map(async (generateSourceName) => {
          const generateSource = await this.createGenerateSourceService.execute(
            { riskId: risk.id, name: generateSourceName, companyId },
            { targetCompanyId: companyId } as any,
            {
              returnIfExist: true,
            },
          );

          mapData.risk[riskName].generateSource[generateSourceName].id = generateSource.id;
        });

        const admsPromises = Object.keys(riskValue.adms).map(async (admName) => {
          const adm = await this.createRecMedService.execute({ medType: 'ADM', riskId: risk.id, medName: admName, companyId }, { targetCompanyId: companyId } as any, {
            returnIfExist: true,
          });

          mapData.risk[riskName].adms[admName].id = adm.id;
        });

        const engsPromises = Object.keys(riskValue.engs).map(async (engName) => {
          const eng = await this.createRecMedService.execute({ medType: 'ENG', riskId: risk.id, medName: engName, companyId }, { targetCompanyId: companyId } as any, {
            returnIfExist: true,
          });

          mapData.risk[riskName].engs[engName].id = eng.id;
        });

        const recsPromises = Object.keys(riskValue.recs).map(async (recName) => {
          const rec = await this.createRecMedService.execute({ riskId: risk.id, recName, companyId }, { targetCompanyId: companyId } as any, {
            returnIfExist: true,
          });

          mapData.risk[riskName].recs[recName].id = rec.id;
        });

        return [...generateSourcePromises, ...admsPromises, ...engsPromises, ...recsPromises];
      })
      .flat(1);

    await asyncBatch(promises, 50, async (promise) => {
      await promise;
    });

    return mapData;
  }

  public async getColumns() {
    return CompanyStructColumnMap;
  }
}
