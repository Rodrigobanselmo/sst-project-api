import { BadRequestException, Injectable } from '@nestjs/common';
import { asyncBatch } from '../../../../../../shared/utils/asyncBatch';
import { PrismaService } from './../../../../../../prisma/prisma.service';
import { IExcelReadData } from './../../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { asyncEach } from './../../../../../../shared/utils/asyncEach';
import { isRiskQuantity } from './../../../../../../shared/utils/isRiskQuantity';
import { CreateHierarchyDto } from './../../../../../company/dto/hierarchy';
import { CreateHomoGroupDto } from './../../../../../company/dto/homoGroup';
import { EmployeeEntity } from './../../../../../company/entities/employee.entity';
import { QuantityTypeEnum } from './../../../../../company/interfaces/risk-data-json.types';
import { EmployeeRepository } from './../../../../../company/repositories/implementations/EmployeeRepository';
import { HierarchyRepository } from './../../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from './../../../../../company/repositories/implementations/HomoGroupRepository';
import { UpsertEmployeeHierarchyHistoryService } from './../../../../../company/services/employee/0-history/hierarchy/upsert/upsert.service';
import { RiskFactorsEntity } from './../../../../../sst/entities/risk.entity';
import { RiskRepository } from './../../../../../sst/repositories/implementations/RiskRepository';
import { CreateGenerateSourceService } from './../../../../../sst/services/generate-source/create-generate-source/create-generate-source.service';
import { CreateRecMedService } from './../../../../../sst/services/rec-med/create-rec-med/create-rec-med.service';
import { CreateRiskService } from './../../../../../sst/services/risk/create-risk/create-risk.service';
import { UpsertRiskDataService } from './../../../../../sst/services/risk-data/upsert-risk-data/upsert-risk.service';

import { formatCPF } from '@brazilian-utils/brazilian-utils';
import { EmployeeHierarchyMotiveTypeEnum, HierarchyEnum } from '@prisma/client';
import clone from 'clone';
import dayjs from 'dayjs';
import sortArray from 'sort-array';
import { EpiRoRiskDataDto } from '../../../../../../modules/sst/dto/epi-risk-data.dto';
import { hierarchyList, hierarchyListReversed } from '../../../../../../shared/constants/lists/hierarchy.list';
import { ExcelProvider } from '../../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { FileFactoryAbstractionCreator } from '../../creator/FileFactoryCreator';
import { IFileFactoryProduct, ISheetData, ISheetExtractedData } from '../../types/IFileFactory.types';
import { CompanyStructColumnMap, CompanyStructHeaderEnum, emptyHierarchy } from './constants/company-struct.constants';
import {
  IBodyFileCompanyStruct,
  ICompanyData,
  IDataReturnHierarchy,
  IEmployeeReturn,
  IEpiReturn,
  IHierarOnHomoDataReturn,
  IHierarchyDataReturn,
  IHomoDataReturn,
  IMapData,
  IWorkDataReturn,
  IWorkspaceData,
} from './types/company-struct.constants';
import { CompanyStructRsDataEmployeeColumnMap } from './constants/company-struct-rsdata-employee.constants';

@Injectable()
export class FileCompanyStructureFactory extends FileFactoryAbstractionCreator<IBodyFileCompanyStruct, CompanyStructHeaderEnum> {
  static splitter = '; ';
  public product = FileCompanyStructureProduct;

  constructor(
    readonly excelProv: ExcelProvider,
    readonly prisma: PrismaService,
    readonly upsertRiskDataService: UpsertRiskDataService,
    readonly riskRepository: RiskRepository,
    readonly createRecMedService: CreateRecMedService,
    readonly createGenerateSourceService: CreateGenerateSourceService,
    readonly createRiskService: CreateRiskService,
    readonly homoGroupRepository: HomoGroupRepository,
    readonly hierarchyRepository: HierarchyRepository,
    readonly employeeRepository: EmployeeRepository,
    readonly upsertEmployeeHierarchyHistoryService: UpsertEmployeeHierarchyHistoryService,
  ) {
    super(excelProv, prisma);
  }

  public factoryMethod(): IFileFactoryProduct {
    return new this.product(
      this.prisma,
      this.upsertRiskDataService,
      this.riskRepository,
      this.createRecMedService,
      this.createGenerateSourceService,
      this.createRiskService,
      this.homoGroupRepository,
      this.hierarchyRepository,
      this.employeeRepository,
      this.upsertEmployeeHierarchyHistoryService,
    );
  }
}

export class FileCompanyStructureProduct implements IFileFactoryProduct {
  public splitter = FileCompanyStructureFactory.splitter;
  public errors: string[] = [];

  public skipRow = (databaseRow: Record<CompanyStructHeaderEnum, any>) => {
    if (typeof databaseRow[CompanyStructHeaderEnum.EMPLOYEE_NAME] !== 'string') return false;

    //RS DATA skip last row
    return databaseRow[CompanyStructHeaderEnum.EMPLOYEE_NAME].includes('Total:');
  };

  private throwError(message: string, options?: { stopFirstError?: boolean }) {
    if (options?.stopFirstError) throw new BadRequestException(message);
    if (!this.errors.includes(message)) this.errors.push(message);
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly riskRepository: RiskRepository,
    private readonly createRecMedService: CreateRecMedService,
    private readonly createGenerateSourceService: CreateGenerateSourceService,
    private readonly createRiskService: CreateRiskService,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly upsertEmployeeHierarchyHistoryService: UpsertEmployeeHierarchyHistoryService,
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

  public async getColumns() {
    return { ...CompanyStructColumnMap, ...CompanyStructRsDataEmployeeColumnMap };
  }

  public async saveData(sheetsData: ISheetExtractedData<CompanyStructHeaderEnum>[], body: IBodyFileCompanyStruct) {
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

    const mapData = this.getMapData(sheetData, company);

    const mapDataWithId = await this.getMapDataWithId(company, mapData, body);

    if (this.errors.length) throw new BadRequestException(this.errors);

    const isRisk = !!Object.keys(mapData.risk).length;
    if (!isRisk) if (!company.riskFactorGroupData?.[0]?.id) throw new BadRequestException(`Sistema de gestão não cadatsrado`);

    return await asyncBatch(sheetData, 20, async (row) => {
      const touchRisk = !!row[CompanyStructHeaderEnum.RISK];
      const workspaceMap = mapDataWithId.workspace[row[CompanyStructHeaderEnum.WORKSPACE]];
      const riskMap = mapDataWithId.risk[row[CompanyStructHeaderEnum.RISK]];
      const episMap = mapDataWithId.epis;

      const hierarchyPath = this.getHierarchyPath(row).join('--');

      if (touchRisk) {
        const json = this.getRiskDataJson(mapDataWithId.risk[row[CompanyStructHeaderEnum.RISK]].data, row);
        const adms = row[CompanyStructHeaderEnum.EPC_OTHERS]?.map((admName: string) => riskMap.adms[admName].id);
        const engs = row[CompanyStructHeaderEnum.EPC]?.map((engName: string) => ({
          recMedId: riskMap.engs[engName].id,
        }));
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
            }) as EpiRoRiskDataDto,
        );

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
      }
    });
  }

  private getHierarchyPath(data: Record<string, string>) {
    const hierarchyArray = hierarchyList.map((key) => (data[CompanyStructHeaderEnum[key]] as string) || emptyHierarchy);

    return hierarchyArray;
  }

  private getHierarchyData(hierarchyArray: string[]) {
    const reverseHierarchyArray = hierarchyArray.reverse();
    const lastHierarchyNameIndex = reverseHierarchyArray.findIndex((i) => i != emptyHierarchy);
    const type = hierarchyListReversed[lastHierarchyNameIndex];
    const name = reverseHierarchyArray[lastHierarchyNameIndex];

    reverseHierarchyArray[lastHierarchyNameIndex] = emptyHierarchy;
    const parentHierarchyPath = reverseHierarchyArray.reverse();

    return { parentHierarchyPath, type, name };
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

  private getMapData(sheetData: ISheetExtractedData<CompanyStructHeaderEnum>, company: ICompanyData) {
    const mapData: IMapData = {
      workspace: {},
      risk: {},
      epis: {},
      cids: {},
    };

    const subOfficeIndex = hierarchyList.findIndex((i) => i == HierarchyEnum.SUB_OFFICE);
    const officeIndex = hierarchyList.findIndex((i) => i == HierarchyEnum.OFFICE);

    sheetData.forEach((row) => {
      if (!row[CompanyStructHeaderEnum.WORKSPACE]) row[CompanyStructHeaderEnum.WORKSPACE] = company?.workspace?.[0]?.name;
      if (!row[CompanyStructHeaderEnum.WORKSPACE]) throw new BadRequestException('Cadastre ou informe um estabelecimento antes de importar os dado');

      if (!mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]])
        mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]] = {
          value: row[CompanyStructHeaderEnum.WORKSPACE],
          hierarchies: {},
          homogeneousGroup: {},
          hierarchyOnHomogeneous: {},
          employees: {},
          // characterization: {},
        };

      const hierarchyArray = this.getHierarchyPath(row);

      const isEmployee = !!row[CompanyStructHeaderEnum.EMPLOYEE_CPF];
      const isEmployeeHistory = !!row[CompanyStructHeaderEnum.EMPLOYEE_ADMISSION];
      const isHierarchy = !!hierarchyArray.find((i) => i != emptyHierarchy);
      const isHomogeneousGroup = row[CompanyStructHeaderEnum.GHO];
      const isRisk = !!row[CompanyStructHeaderEnum.RISK];

      if (isHomogeneousGroup) {
        mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].homogeneousGroup[row[CompanyStructHeaderEnum.GHO]] = {
          value: row[CompanyStructHeaderEnum.GHO],
          description: row[CompanyStructHeaderEnum.GHO_DESCRIPTION],
        };
      }

      if (isHierarchy) {
        hierarchyArray.forEach((hierarchyName, index) => {
          if (hierarchyName == emptyHierarchy) return;

          const hierarchyNewArray = hierarchyArray.slice(0, index + 1).concat(hierarchyArray.slice(index + 1).map(() => emptyHierarchy));
          const hierarchyPath = hierarchyNewArray.join('--');

          if (mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].hierarchies[hierarchyPath]) return;

          const { parentHierarchyPath, name, type } = this.getHierarchyData(clone(hierarchyNewArray));
          mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].hierarchies[hierarchyPath] = {
            name,
            type,
            value: hierarchyPath,
            parentPath: parentHierarchyPath.join('--'),
            cbo: row[CompanyStructHeaderEnum.CBO],
            ...(index == officeIndex && {
              description: row[CompanyStructHeaderEnum.OFFICE_DESCRIPTION],
              realDescription: row[CompanyStructHeaderEnum.OFFICE_REAL_DESCRIPTION],
            }),
          };
        });
      }

      if (isHierarchy && isHomogeneousGroup) {
        const hierarchyPath = hierarchyArray.join('--');
        const ghoName = row[CompanyStructHeaderEnum.GHO];
        const value = ghoName + hierarchyPath;

        mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].hierarchyOnHomogeneous[value] = {
          value,
          ghoName,
          hierarchyPath,
        };
      }

      // if (!isHierarchy && !isHomogeneousGroup) throw new BadRequestException(`Informe ao menos um Setor, Cargo ou Grupo homogênio (Obrigatório)`);
      if (!isHierarchy && isEmployeeHistory) throw new BadRequestException(`Quando informado data de admissão, informe ao menos um Setor e Cargo (Obrigatório)`);

      if (isEmployee) {
        const isOffice = hierarchyArray?.[officeIndex] != emptyHierarchy;
        const isSubOffice = hierarchyArray?.[subOfficeIndex] != emptyHierarchy;

        if (!mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].employees[row[CompanyStructHeaderEnum.EMPLOYEE_CPF]])
          mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].employees[row[CompanyStructHeaderEnum.EMPLOYEE_CPF]] = {
            value: row[CompanyStructHeaderEnum.EMPLOYEE_CPF],
            name: row[CompanyStructHeaderEnum.EMPLOYEE_NAME],
            birth: row[CompanyStructHeaderEnum.EMPLOYEE_BIRTH],
            email: row[CompanyStructHeaderEnum.EMPLOYEE_EMAIL],
            isPcd: row[CompanyStructHeaderEnum.EMPLOYEE_IS_PCD],
            esocialCode: row[CompanyStructHeaderEnum.ESOCIAL_CODE],
            cbo: row[CompanyStructHeaderEnum.CBO],
            phone: row[CompanyStructHeaderEnum.EMPLOYEE_PHONE],
            rg: row[CompanyStructHeaderEnum.EMPLOYEE_RG],
            lastExam: row[CompanyStructHeaderEnum.LAST_EXAM],
            sex: row[CompanyStructHeaderEnum.EMPLOYEE_SEX],
            socialName: row[CompanyStructHeaderEnum.EMPLOYEE_SOCIAL_NAME],
            employeesHistory: {},
            cids: {},
          };

        const isCid = !!row[CompanyStructHeaderEnum.EMPLOYEE_CIDS];

        if (isCid) {
          row[CompanyStructHeaderEnum.EMPLOYEE_CIDS].map((value: string) => {
            mapData.cids[value] = value;
            mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].employees[row[CompanyStructHeaderEnum.EMPLOYEE_CPF]].cids[value] = value;
          });
        }

        if (isEmployeeHistory) {
          const adm = EmployeeHierarchyMotiveTypeEnum.ADM;
          const dem = EmployeeHierarchyMotiveTypeEnum.DEM;

          const admDate = row[CompanyStructHeaderEnum.EMPLOYEE_ADMISSION];
          const demDate = row[CompanyStructHeaderEnum.EMPLOYEE_DEMISSION];

          if (admDate && isOffice) {
            const value = adm + dayjs(admDate).format('YYYY-MM-DD');
            mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].employees[row[CompanyStructHeaderEnum.EMPLOYEE_CPF]].employeesHistory[value] = {
              value: value,
              motive: adm,
              startDate: row[CompanyStructHeaderEnum.EMPLOYEE_ADMISSION],
              officePath: hierarchyArray
                .slice(0, officeIndex + 1)
                .concat(hierarchyArray.slice(officeIndex + 1).map(() => emptyHierarchy))
                .join('--'),
              ...(isSubOffice && {
                subOfficePath: hierarchyArray
                  .slice(0, subOfficeIndex + 1)
                  .concat(hierarchyArray.slice(subOfficeIndex + 1).map(() => emptyHierarchy))
                  .join('--'),
              }),
            };
          }

          if (demDate) {
            const value = dem + dayjs(demDate).format('YYYY-MM-DD');
            mapData.workspace[row[CompanyStructHeaderEnum.WORKSPACE]].employees[row[CompanyStructHeaderEnum.EMPLOYEE_CPF]].employeesHistory[value] = {
              value: value,
              motive: dem,
              startDate: row[CompanyStructHeaderEnum.EMPLOYEE_DEMISSION],
            };
          }
        }
      }

      if (isRisk) {
        if (!mapData.risk[row[CompanyStructHeaderEnum.RISK]])
          mapData.risk[row[CompanyStructHeaderEnum.RISK]] = {
            value: row[CompanyStructHeaderEnum.RISK],
            generateSource: {},
            engs: {},
            adms: {},
            recs: {},
            data: {} as any,
            // Risk creation fields
            severity: row[CompanyStructHeaderEnum.RISK_SEVERITY],
            risk: row[CompanyStructHeaderEnum.RISK_DESCRIPTION],
            symptoms: row[CompanyStructHeaderEnum.RISK_SYMPTOMS],
            type: row[CompanyStructHeaderEnum.RISK_TYPE],
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

  // search on database for all data and create map
  private async getDatabaseMaps(company: ICompanyData, mapData: IMapData, body: IBodyFileCompanyStruct) {
    const workspaces = company.workspace;
    const companyId = company.id;

    const episKeys = Object.keys(mapData.epis);
    const homoGroupsKeys = Object.keys(workspaces.map((w) => (mapData.workspace[w.name] || mapData.workspace[w.abbreviation])?.homogeneousGroup).flat(1));
    const hierarchyKeys = Object.keys(workspaces.map((w) => (mapData.workspace[w.name] || mapData.workspace[w.abbreviation])?.hierarchies).flat(1));
    const employeeKeys = Object.keys(workspaces.map((w) => (mapData.workspace[w.name] || mapData.workspace[w.abbreviation])?.employees).flat(1));
    const riskKeys = Object.keys(mapData.risk);

    const cidsKeys = Object.keys(mapData.cids);
    // const cidsKeys = Object.values(workspaces.map((w) => (mapData.workspace[w.name] || mapData.workspace[w.abbreviation])?.employees)).map(
    //   (employeeMap) => {
    //     return Object.values(employeeMap).map((employee) => Object.keys(employee.cids));
    //   }
    // ).flat(2)

    const cidsPromise = cidsKeys.length ? this.prisma.cid.findMany({ where: { cid: { in: cidsKeys } }, select: { cid: true } }) : undefined;

    const episPromise = episKeys.length ? this.prisma.epi.findMany({ where: { ca: { in: episKeys } }, select: { id: true, ca: true } }) : undefined;

    const homoGroupsPromise = homoGroupsKeys.length
      ? this.prisma.homogeneousGroup.findMany({
          where: { companyId, type: null, status: 'ACTIVE' },
          select: { name: true, id: true, hierarchyOnHomogeneous: { select: { hierarchyId: true, id: true } } },
        })
      : undefined;

    const hierarchiesPromise = hierarchyKeys.length
      ? this.prisma.hierarchy.findMany({
          where: { companyId, status: 'ACTIVE' },
          select: { id: true, name: true, parentId: true, type: true, workspaces: { select: { id: true } } },
        })
      : undefined;

    const riskPromise = riskKeys.length
      ? this.riskRepository.findAllAvailable(companyId, {
          where: { name: { in: riskKeys } },
          select: { id: true, name: true, esocialCode: true, type: true },
        })
      : undefined;

    const employeePromise =
      employeeKeys.length && !body.createEmployee
        ? this.employeeRepository.findNude({
            where: { companyId, ...(employeeKeys.length < 300 && { cpf: { in: employeeKeys } }) },
            select: { id: true, cpf: true },
          })
        : undefined;

    const [epis, homoGroups, hierarchies, risk, employees, cids] = await Promise.all([episPromise, homoGroupsPromise, hierarchiesPromise, riskPromise, employeePromise, cidsPromise]);

    const homoGroupsMap: Record<string, IHomoDataReturn> = {};
    const hierarchyMap: Record<string, IHierarchyDataReturn> = {};
    const hierarOnHomoMap: Record<string, IHierarOnHomoDataReturn> = {};
    const riskMap: Record<string, RiskFactorsEntity> = {};
    const workspaceMap: Record<string, IWorkDataReturn> = {};
    const episMap: Record<string, IEpiReturn> = {};
    const employeesMap: Record<string, IEmployeeReturn> = {};
    const cidsMap: Record<string, string> = {};

    const hierarchyPathMap: Record<string, IHierarchyDataReturn> = {};

    cids?.forEach((cid) => {
      cidsMap[cid.cid] = cid.cid;
    });

    epis?.forEach((epi) => {
      episMap[epi.ca] = epi;
    });

    employees?.forEach((employee) => {
      employeesMap[employee.cpf] = employee;
    });

    homoGroups?.forEach((homo) => {
      homoGroupsMap[homo.name] = homo;

      homo.hierarchyOnHomogeneous.forEach((hh) => {
        hierarOnHomoMap[`${homo.id}${hh.hierarchyId}`] = {
          hierarchyId: hh.hierarchyId,
          homogeneousGroupId: homo.id,
          id: hh.id,
        };
      });
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

    return {
      homoGroupsMap,
      hierarchyPathMap,
      hierarchyMap,
      hierarOnHomoMap,
      riskMap,
      workspaceMap,
      episMap,
      company,
      employeesMap,
      cidsMap,
    };
  }

  // get the database existent data, create a map using getDatabaseMaps and compare with xml map data
  private async getMapDataWithId(company: ICompanyData, mapData: IMapData, body: IBodyFileCompanyStruct) {
    const companyId = company.id;
    const { homoGroupsMap, riskMap, workspaceMap, hierarchyPathMap, episMap, hierarOnHomoMap, employeesMap, cidsMap } = await this.getDatabaseMaps(company, mapData, body);

    Object.entries(mapData.cids).map(([cid]) => {
      const cidId = cidsMap[cid];
      if (!cidId) return this.throwError(`CID: ${cid} não encontrado`, body);
    });

    Object.entries(mapData.epis).map(([ca]) => {
      const epiId = episMap[ca]?.id;
      if (!epiId) return this.throwError(`Epi de ca: ${ca} não encontrado`, body);

      mapData.epis[ca].id = epiId;
    });

    const promisesWorkspaces = Object.entries(mapData.workspace).map(async ([workspaceName, workspaceValue]) => {
      const workspaceId = workspaceMap[workspaceName]?.id;
      if (!workspaceId) return this.throwError(`Estabelecimento ${workspaceName} não encontrado`);

      mapData.workspace[workspaceName].id = workspaceId;

      const promisesHomogroups = Object.keys(workspaceValue.homogeneousGroup).map((homoName) => {
        const homogeneousGroupId = homoGroupsMap[homoName]?.id;
        if (!homogeneousGroupId && !body.createHomo) {
          return this.throwError(`Grupo homogênio ${homoName} não encontrado`);
        }

        return async () => {
          if (!homogeneousGroupId && body.createHomo) {
            const homogroupImportData = workspaceValue.homogeneousGroup[homoName];
            const homogroup = await this.createHomogroup(
              {
                companyId,
                name: homoName,
                description: homogroupImportData.description || '',
                workspaceIds: [workspaceId],
              },
              company,
            );
            mapData.workspace[workspaceName].homogeneousGroup[homoName].id = homogroup.id;
          } else {
            mapData.workspace[workspaceName].homogeneousGroup[homoName].id = homogeneousGroupId;
          }
        };
      });

      const handleHierarchy = (hierarchiesMan: IDataReturnHierarchy[]) => {
        return hierarchiesMan.map(({ value: hierarchyPath }) => {
          const fullPath = workspaceId + '--' + hierarchyPath;
          const hierarchyFullPathId = hierarchyPathMap[fullPath]?.id;

          if (!hierarchyFullPathId && !body.createHierarchy) {
            return this.throwError(
              `Departamento ${hierarchyPath
                .split('--')
                .filter((v) => v != emptyHierarchy)
                .join(' --> ')} não encontrado`,
            );
          }

          return async () => {
            const hierarchyImportData = workspaceValue.hierarchies[hierarchyPath];
            let hierarchyId = hierarchyFullPathId;

            if (!hierarchyId && body.createHierarchy) {
              const hierarchy = await this.createHierarchy(
                {
                  companyId,
                  name: hierarchyImportData.name,
                  description: hierarchyImportData.description || '',
                  type: hierarchyImportData.type,
                  realDescription: hierarchyImportData.realDescription,
                  workspaceIds: [workspaceId],
                  parentId: (mapData.workspace[workspaceName].hierarchies[hierarchyImportData.parentPath]?.id as string) || null,
                },
                company,
              );

              hierarchyId = hierarchy.id;
            }

            mapData.workspace[workspaceName].hierarchies[hierarchyPath].id = hierarchyId;
          };
        });
      };

      const hierarchies = Object.values(workspaceValue.hierarchies);
      const promiseHierarchiesDir = handleHierarchy(hierarchies.filter((h) => h.type == HierarchyEnum.DIRECTORY));
      const promiseHierarchiesMan = handleHierarchy(hierarchies.filter((h) => h.type == HierarchyEnum.MANAGEMENT));
      const promiseHierarchiesSec = handleHierarchy(hierarchies.filter((h) => h.type == HierarchyEnum.SECTOR));
      const promiseHierarchiesSubSec = handleHierarchy(hierarchies.filter((h) => h.type == HierarchyEnum.SUB_SECTOR));
      const promiseHierarchiesOff = handleHierarchy(hierarchies.filter((h) => h.type == HierarchyEnum.OFFICE));
      const promiseHierarchiesSubOff = handleHierarchy(hierarchies.filter((h) => h.type == HierarchyEnum.SUB_OFFICE));

      const promisesEmployees = Object.keys(workspaceValue.employees).map((cpf) => {
        const employeeId = employeesMap[cpf]?.id;
        if (!employeeId && !body.createEmployee) {
          return this.throwError(`Empregado de CPF ${formatCPF(cpf)} não encontrado`);
        }

        return async () => {
          let employee: EmployeeEntity;
          const employeeImportData = workspaceValue.employees[cpf];
          if (!employeeId && body.createEmployee) {
            employee = await this.upsertEmlpoyee(employeeImportData, cpf, companyId);

            mapData.workspace[workspaceName].employees[cpf].id = employee.id;
          } else {
            mapData.workspace[workspaceName].employees[cpf].id = employeeId;
          }

          const hierarchyHistory = sortArray(Object.values(employeeImportData.employeesHistory), {
            by: ['startDate', 'motive'],
            order: ['asc', 'motive'],
            customOrders: {
              motive: [EmployeeHierarchyMotiveTypeEnum.DEM, EmployeeHierarchyMotiveTypeEnum.ADM],
            },
          });

          await asyncEach(hierarchyHistory, async (history) => {
            const subOfficeId = mapData.workspace[workspaceName].hierarchies[history.subOfficePath]?.id as string;
            const hierarchyId = mapData.workspace[workspaceName].hierarchies[history.officePath]?.id as string;

            const historyData = await this.upsertEmployeeHierarchyHistoryService.execute(
              {
                companyId,
                employeeId: mapData.workspace[workspaceName].employees[cpf].id as number,
                startDate: history.startDate,
                motive: history.motive,
                ...(subOfficeId && { subOfficeId }),
                ...(hierarchyId && { hierarchyId }),
              },
              body.user,
              employee,
            );

            if (!employee.hierarchyHistory) employee.hierarchyHistory = [];
            if (historyData) employee.hierarchyHistory.push(historyData);
          });
        };
      });

      if (this.errors.length == 0) {
        await asyncEach([promiseHierarchiesDir, promiseHierarchiesMan, promiseHierarchiesSec, promiseHierarchiesSubSec, promiseHierarchiesOff, promiseHierarchiesSubOff], async (promises) => {
          await asyncBatch(promises, 50, async (promise) => {
            if (typeof promise === 'function') {
              await promise();
            }
          });
        });

        await asyncBatch([...promisesHomogroups, ...promisesEmployees], 50, async (promise) => {
          if (typeof promise === 'function') {
            await promise();
          }
        });

        if (body.createHierOnHomo) {
          const hierarchyOnHomogeneous = mapData.workspace[workspaceName].hierarchyOnHomogeneous;

          await asyncBatch(Object.values(hierarchyOnHomogeneous), 50, async (hh) => {
            const hierarchyId = mapData.workspace[workspaceName].hierarchies[hh.hierarchyPath]?.id as string;
            const homogeneousGroupId = mapData.workspace[workspaceName].homogeneousGroup[hh.ghoName]?.id as string;

            const hierarOnHomoId = hierarOnHomoMap[homogeneousGroupId + hierarchyId]?.id;
            if (!hierarOnHomoId) {
              await this.createHomoHierarchy(homogeneousGroupId, hierarchyId);
            }
          });
        }
      }

      return;
    });

    await Promise.all(promisesWorkspaces);

    // First, create missing risks and add them to riskMap

    if (body.createRisk) {
      const createRiskPromises = Object.entries(mapData.risk)
        .filter(([riskName]) => !riskMap[riskName])
        .map(([riskName, riskValue]) => {
          if (!riskValue.severity) {
            return this.throwError(`Severidade do risco ${riskName} não informada`);
          }

          return async () => {
            const newRisk = await this.createRiskService.execute(
              {
                name: riskName,
                severity: riskValue.severity || 0,
                risk: riskValue.risk || '',
                symptoms: riskValue.symptoms || '',
                type: (riskValue.type as any) || 'FIS',
                companyId: companyId,
              },
              body.user,
            );

            riskMap[riskName] = newRisk;
            mapData.risk[riskName].data = newRisk;
          };
        });

      if (createRiskPromises.length > 0) {
        await asyncBatch(createRiskPromises, 50, async (promise) => {
          if (typeof promise === 'function') {
            await promise();
          }
        });
      }
    }

    console.log('riskMap', riskMap);

    // Now process all risks (existing and newly created)
    const promisesRisks = Object.entries(mapData.risk)
      .map(([riskName, riskValue]) => {
        const risk = riskMap[riskName];

        if (!risk) {
          return this.throwError(`Risco ${riskName} não encontrado`);
        }

        mapData.risk[riskName].id = risk.id;
        mapData.risk[riskName].data = risk;

        const generateSourcePromises = Object.keys(riskValue.generateSource).map((generateSourceName) => {
          return async () => {
            const generateSource = await this.createGenerateSourceService.execute({ riskId: risk.id, name: generateSourceName, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });

            mapData.risk[riskName].generateSource[generateSourceName].id = generateSource.id;
          };
        });

        const admsPromises = Object.keys(riskValue.adms).map((admName) => {
          return async () => {
            const adm = await this.createRecMedService.execute({ medType: 'ADM', riskId: risk.id, medName: admName, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });

            mapData.risk[riskName].adms[admName].id = adm.id;
          };
        });

        const engsPromises = Object.keys(riskValue.engs).map((engName) => {
          return async () => {
            const eng = await this.createRecMedService.execute({ medType: 'ENG', riskId: risk.id, medName: engName, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });

            mapData.risk[riskName].engs[engName].id = eng.id;
          };
        });

        const recsPromises = Object.keys(riskValue.recs).map((recName) => {
          return async () => {
            const rec = await this.createRecMedService.execute({ riskId: risk.id, recName, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });

            mapData.risk[riskName].recs[recName].id = rec.id;
          };
        });

        return [...generateSourcePromises, ...admsPromises, ...engsPromises, ...recsPromises];
      })
      .flat(1);

    if (this.errors.length == 0) {
      await asyncBatch(promisesRisks, 50, async (promise) => {
        if (promise) await promise();
      });
    }
    return mapData;
  }

  private async createHomogroup(data: CreateHomoGroupDto, company: ICompanyData) {
    const homo = await this.homoGroupRepository.upsertForImport({
      name: data.name,
      companyId: company.id,
      workspaceIds: data.workspaceIds,
      description: data.description,
    });

    return homo;
  }

  private async createHierarchy(data: CreateHierarchyDto, company: ICompanyData) {
    const hierarchies = await this.hierarchyRepository.upsert(
      {
        companyId: company.id,
        ...data,
      },
      company.id,
    );

    return hierarchies;
  }

  private async createHomoHierarchy(homogeneousGroupId: string, hierarchyId: string) {
    return await this.homoGroupRepository.createNewHierarchyOnHomogeneousIfNeeded({
      homogeneousGroupId,
      hierarchyId,
    });
  }

  private async upsertEmlpoyee(employeeImportData: IWorkspaceData['employees']['0'], cpf: string, companyId: string) {
    return await this.employeeRepository.upsertImport({
      companyId,
      cpf,
      ...(employeeImportData.name && { name: employeeImportData.name }),
      ...(employeeImportData.rg && { rg: employeeImportData.rg }),
      ...(employeeImportData.email && { email: employeeImportData.email }),
      ...(employeeImportData.phone && { phone: employeeImportData.phone }),
      ...(employeeImportData.birth && { birthday: employeeImportData.birth }),
      ...(employeeImportData.cbo && { cbo: employeeImportData.cbo }),
      ...(employeeImportData.esocialCode && { esocialCode: employeeImportData.esocialCode }),
      ...(employeeImportData.lastExam && { lastExam: employeeImportData.lastExam }),
      ...(employeeImportData.sex && { sex: employeeImportData.sex }),
      ...(employeeImportData.socialName && { socialName: employeeImportData.socialName }),
      ...(typeof employeeImportData.isPcd == 'boolean' && { isPcd: employeeImportData.isPcd }),
      ...(employeeImportData.cids && { cidIds: Object.values(employeeImportData.cids) }),
    });
  }
}
