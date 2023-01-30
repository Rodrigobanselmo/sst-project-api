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
import { BadRequestException, Injectable } from '@nestjs/common';

import { ExcelProvider } from '../../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { FindCompaniesDto } from '../../../../../company/dto/company.dto';
import { FileFactoryAbstractionCreator } from '../../creator/FileFactoryCreator';
import { IColumnRuleMap, IFileFactoryProduct, ISheetData } from '../../types/IFileFactory.types';
import { CompanyStructColumnMap, CompanyStructHeaderEnum } from './constants/company-struct.constants';

@Injectable()
export class FileCompanyStructureFactory extends FileFactoryAbstractionCreator {
  constructor(
    private readonly excelProv: ExcelProvider,
    private readonly prisma: PrismaService,
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly findAllAvailableRiskService: FindAllAvailableRiskService,
    private readonly createRecMedService: CreateRecMedService,
    private readonly createGenerateSourceService: CreateGenerateSourceService,
  ) {
    super(excelProv);
  }

  public factoryMethod(): IFileFactoryProduct {
    return new FileFactoryProduct(this.prisma, this.upsertRiskDataService, this.findAllAvailableRiskService, this.createRecMedService, this.createGenerateSourceService);
  }
}

class FileFactoryProduct implements IFileFactoryProduct {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly findAllAvailableRiskService: FindAllAvailableRiskService,
    private readonly createRecMedService: CreateRecMedService,
    private readonly createGenerateSourceService: CreateGenerateSourceService,
  ) {
    //
  }

  public execute() {
    const columnsMap = CompanyStructColumnMap;

    return { columnsMap, startRowIndex: 2 };
  }

  public getSheets(readFileData: IExcelReadData[]) {
    const columnsMap = CompanyStructColumnMap;

    const sheets = readFileData
      .map((sheet) => {
        return { sheetName: sheet.name, rows: sheet.data, columnsMap };
      })
      .slice(0, 1);

    return sheets;
  }

  public async saveData(sheetsData: Record<Partial<CompanyStructHeaderEnum>, any>[][]) {
    const cache = new Map();
    const sheetData = sheetsData[0];

    const groupByInitial = sheetData.reduce((acc, curr) => {
      const initials = curr[CompanyStructHeaderEnum.COMPANY_SIGLA];
      const workspaceName = curr[CompanyStructHeaderEnum.WORKSPACE];

      acc[`${initials}---${workspaceName}`] = [initials, workspaceName];
      return acc;
    }, {} as Record<string, [string, string]>);

    await Promise.all(
      Object.values(groupByInitial).map(async ([initials]) => {
        const companyKey = 'company' + initials;
        if (!cache.get(companyKey)) {
          const company = await this.prisma.company.findFirst({
            where: { initials: initials },
            select: { id: true, riskFactorGroupData: { select: { id: true } } },
          });

          if (!company?.id) throw new BadRequestException(`Empresa não encontrada`);
          console.log(company);
          const companyId = company.id;

          const homoGroups = await this.prisma.homogeneousGroup.findMany({ where: { companyId, status: 'ACTIVE' }, select: { name: true, id: true } });
          const risk = await this.findAllAvailableRiskService.execute({ targetCompanyId: companyId } as any);
          // const hierarchies = await this.prisma.hierarchy.findMany({ where: { companyId, workspaces: { some: { id: workspaceId } } } });

          const homoGroupsMap: Record<string, string> = {};
          const riskMap: Record<string, RiskFactorsEntity> = {};

          homoGroups.forEach((homo) => {
            homoGroupsMap[homo.name] = homo.id;
          });

          risk.forEach((risk) => {
            riskMap[risk.name] = risk;
          });

          cache.set(companyKey, { company, homoGroupsMap, riskMap });
        }
      }),
    );

    await asyncBatch(sheetData, 20, async (row) => {
      const companyKey = 'company' + row[CompanyStructHeaderEnum.COMPANY_SIGLA];

      // if (!cache.get('workspace')) {
      //   const workspace = await this.prisma.company.findFirst({ where: { initials: sheet[CompanyStructHeaderEnum.COMPANY_SIGLA] }, select: { id: true } });
      //   cache.set('workspace', workspace);
      // }

      const companyDta = cache.get(companyKey) as {
        company: CompanyEntity;
        homoGroupsMap: Record<string, string>;
        riskMap: Record<string, RiskFactorsEntity>;
      };

      if (!companyDta) throw new BadRequestException(`Empresa não encontrada`);

      const { company, homoGroupsMap, riskMap } = companyDta;

      const companyId = company.id;
      // const workspaceId = cache['workspace'].id;

      if (!riskMap[row[CompanyStructHeaderEnum.RISK]]) throw new BadRequestException(`Risco com nome "${row[CompanyStructHeaderEnum.RISK]}" não encontrado`);

      // if (!homoGroupsMap[row[CompanyStructHeaderEnum.GHO]])
      //   throw new BadRequestException(`Grupo homogênio com nome "${row[CompanyStructHeaderEnum.GHO]}" não encontrado`);
      if (!homoGroupsMap[row[CompanyStructHeaderEnum.GHO]]) return; //! remove and add above

      if (!company.riskFactorGroupData[0].id) throw new BadRequestException(`Sistema de gestão não cadatsrado`);

      const json = this.getRiskDataJson(riskMap[row[CompanyStructHeaderEnum.RISK]], row);
      const riskId = riskMap[row[CompanyStructHeaderEnum.RISK]].id;
      let adms;
      let engs;
      let recs;
      let epis;
      let source;

      if (row[CompanyStructHeaderEnum.SOURCE]?.length) {
        source = await Promise.all(
          row[CompanyStructHeaderEnum.SOURCE].map(async (adm) => {
            const source = await this.createGenerateSourceService.execute({ riskId, name: adm, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });
            return source.id;
          }),
        );
      }

      if (row[CompanyStructHeaderEnum.EPC_OTHERS]?.length) {
        adms = await Promise.all(
          row[CompanyStructHeaderEnum.EPC_OTHERS].map(async (adm) => {
            const recMed = await this.createRecMedService.execute({ medType: 'ADM', riskId, medName: adm, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });
            return recMed.id;
          }),
        );
      }

      if (row[CompanyStructHeaderEnum.EPC]?.length) {
        engs = await Promise.all(
          row[CompanyStructHeaderEnum.EPC].map(async (adm) => {
            const recMed = await this.createRecMedService.execute({ medType: 'ENG', riskId, medName: adm, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });
            return { recMedId: recMed.id };
          }),
        );
      }

      if (row[CompanyStructHeaderEnum.REC]?.length) {
        recs = await Promise.all(
          row[CompanyStructHeaderEnum.REC].map(async (adm) => {
            const recMed = await this.createRecMedService.execute({ recType: 'ADM', riskId, recName: adm, companyId }, { targetCompanyId: companyId } as any, {
              returnIfExist: true,
            });
            return recMed.id;
          }),
        );
      }

      if (row[CompanyStructHeaderEnum.EPI_CA]?.length) {
        epis = await Promise.all(
          row[CompanyStructHeaderEnum.EPI_CA].map(async (ca) => {
            const epi = await this.prisma.epi.findFirst({ where: { ca: ca }, select: { id: true } });
            return { epiId: epi.id };
          }),
        );
      }

      await this.upsertRiskDataService.execute({
        companyId,
        homogeneousGroupId: homoGroupsMap[row[CompanyStructHeaderEnum.GHO]],
        riskId,
        riskFactorGroupDataId: company.riskFactorGroupData[0].id,
        adms,
        engs,
        recs,
        epis,
        generateSources: source,
        keepEmpty: true,
        probability: row[CompanyStructHeaderEnum.PROB],
        probabilityAfter: row[CompanyStructHeaderEnum.PROB_REC],
        ...(json && { json }),
        ...(row[CompanyStructHeaderEnum.END_DATE] && { endDate: row[CompanyStructHeaderEnum.END_DATE] }),
        ...(row[CompanyStructHeaderEnum.START_DATE] && { endDate: row[CompanyStructHeaderEnum.START_DATE] }),
      });
    });
  }

  public getRiskDataJson(risk: RiskFactorsEntity, data: Record<Partial<CompanyStructHeaderEnum>, any>) {
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
        ibtug: data[CompanyStructHeaderEnum.IBTU] || '',
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
}
