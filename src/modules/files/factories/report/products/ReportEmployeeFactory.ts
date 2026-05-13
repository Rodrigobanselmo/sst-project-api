import { Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyEntity } from '../../../../company/entities/company.entity';

import { EmployeeEntity } from '../../../../../modules/company/entities/employee.entity';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import { getCompany } from '../helpers/getCompanyInfo';
import {
  IReportCell,
  IReportFactoryProduct,
  IReportFactoryProductFindData,
  IReportSanitizeData,
} from '../types/IReportFactory.types';
import { DownloadFactoryProduct } from './DownaldEmployeeModelFactory';

@Injectable()
export class ReportEmployeeModelFactory extends ReportFactoryAbstractionCreator<any> {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly excelProv: ExcelProvider,
    private readonly dayjsProvider: DayJSProvider,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<any> {
    return new ReportFactoryProduct(this.companyRepository, this.employeeRepository, this.dayjsProvider, this.hierarchyRepository);
  }
}

class ReportFactoryProduct extends DownloadFactoryProduct {
  constructor(
    private readonly _companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly dayjsProvider: DayJSProvider,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {
    super(_companyRepository);
  }

  public async findTableData(companyId: string) {
    const company = await getCompany(companyId, this._companyRepository);

    const { data } = await this.employeeRepository.find(
      {
        getEsocialCode: true,
        getHierarchyDescription: true,
        companyId,
        getAllHierarchyNames: true,
      } as any,
      { take: 50000 },
      {
        select: {
          phone: true,
          birthday: true,
          sex: true,
          isPCD: true,
          socialName: true,
          cbo: true,
          cids: { select: { cid: true } },
        },
      } as any,
    );

    const hierarchies = await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
      returnWorkspace: true,
      include: {
        workspaces: { select: { id: true, abbreviation: true, name: true } },
        hierarchyOnHomogeneous: {
          where: { endDate: null },
          include: {
            homogeneousGroup: { select: { name: true, description: true, type: true } },
          },
        },
      },
    });

    const hierarchyMap = new Map(hierarchies.map((h) => [h.id, h]));

    const sanitizeData = this.sanitizeData({ employees: data, company, hierarchyMap });
    const headerData = this.getHeader(company);
    const titleData = this.getTitle(headerData, company);
    const infoData = [];

    const returnData: IReportFactoryProductFindData = {
      headerRow: headerData,
      titleRows: titleData,
      endRows: infoData,
      sanitizeData,
    };

    return returnData;
  }

  public sanitizeData({
    employees,
    company,
    hierarchyMap,
  }: {
    employees: EmployeeEntity[];
    company?: CompanyEntity;
    hierarchyMap?: Map<string, any>;
  }): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = [];
    const hasMultipleWorkspaces = company?.workspace?.length > 1;

    employees.forEach((employee) => {
      let workspaceAbbreviations = '';
      let ghoName = '';
      let ghoDescription = '';

      if (employee.hierarchyId && hierarchyMap) {
        const hierarchy = hierarchyMap.get(employee.hierarchyId);
        if (hierarchy) {
          if (hasMultipleWorkspaces && hierarchy.workspaces?.length) {
            workspaceAbbreviations = hierarchy.workspaces
              .map((w) => w.abbreviation || w.name)
              .join('; ');
          }

          const homoGroups = hierarchy.hierarchyOnHomogeneous
            ?.map((hoh) => hoh.homogeneousGroup)
            ?.filter((g) => g && !g.type);

          if (homoGroups?.length === 1) {
            ghoName = homoGroups[0].name || '';
            ghoDescription = homoGroups[0].description || '';
          }
        }
      }

      const subOfficeName = employee.subOffices?.length
        ? employee.subOffices.map((so) => so.name).join('; ')
        : '';

      const cidCodes = employee.cids?.length
        ? employee.cids.map((c) => c.cid || '').join('; ')
        : '';

      const formatDate = (date: Date) => (date ? this.dayjsProvider.format(date, 'DD/MM/YYYY') : '');

      const row: IReportSanitizeData = {
        ...(hasMultipleWorkspaces && { workspace: { content: workspaceAbbreviations } }),
        cpf: { content: employee.cpf || '' },
        name: { content: employee.name || '' },
        sex: { content: employee.sex || '' },
        birthday: { content: formatDate(employee.birthday) },
        rg: { content: employee.rg || '' },
        socialName: { content: employee.socialName || '' },
        email: { content: employee.email || '' },
        phone: { content: employee.phone || '' },
        isPCD: { content: employee.isPCD ? 'S' : '' },
        cids: { content: cidCodes },
        admissionDate: { content: formatDate(employee.admissionDate) },
        demissionDate: { content: formatDate(employee.demissionDate) },
        esocialCode: { content: employee.esocialCode || '' },
        lastExam: { content: formatDate(employee.lastExam) },
        directory: { content: employee.directory?.name || '' },
        management: { content: employee.management?.name || '' },
        sector: { content: employee.sector?.name || '' },
        subSector: { content: employee.sub_sector?.name || '' },
        office: { content: employee.office?.name || '' },
        subOffice: { content: subOfficeName },
        cbo: { content: employee.cbo || '' },
        officeDescription: { content: employee.hierarchy?.description || '' },
        officeRealDescription: { content: employee.hierarchy?.realDescription || '' },
        gho: { content: ghoName },
        ghoDescription: { content: ghoDescription },
      };

      rows.push(row);
    });

    return rows;
  }

  public getFilename(company: CompanyEntity): string {
    const filename = `Planilha de Importação Funcionários (${company.fantasy || company.name})`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Funcionários`;

    return name;
  }

  public getEndInformation(): IReportCell[][] {
    const rows = [];

    return rows;
  }
}
