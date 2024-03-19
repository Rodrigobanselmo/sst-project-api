import { Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyEntity } from '../../../../company/entities/company.entity';

import { EmployeeEntity } from '../../../../../modules/company/entities/employee.entity';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import { getCompany } from '../helpers/getCompanyInfo';
import { IReportCell, IReportFactoryProduct, IReportFactoryProductFindData, IReportSanitizeData } from '../types/IReportFactory.types';
import { DownloadFactoryProduct } from './DownaldEmployeeModelFactory';

@Injectable()
export class ReportEmployeeModelFactory extends ReportFactoryAbstractionCreator<any> {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly excelProv: ExcelProvider,
    private readonly dayjsProvider: DayJSProvider,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<any> {
    return new ReportFactoryProduct(this.companyRepository, this.employeeRepository, this.dayjsProvider);
  }
}

class ReportFactoryProduct extends DownloadFactoryProduct {
  constructor(
    private readonly _companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly dayjsProvider: DayJSProvider,
  ) {
    super(_companyRepository);
  }

  public async findTableData(companyId: string) {
    const company = await getCompany(companyId, this._companyRepository);

    const { data } = await this.employeeRepository.find({
      getEsocialCode: true,
      getHierarchyDescription: true,
      getAllHierarchyNames: true, //! trocar se for buscar de varias empresa já que busca por id de todos as hierarchies, performace ruim do prisma
    }, { take: 50000 })


    const sanitizeData = this.sanitizeData({ employees: data });
    const headerData = this.getHeader(company);
    const titleData = this.getTitle(headerData, company);
    const infoData = [];

    const returnData: IReportFactoryProductFindData = { headerRow: headerData, titleRows: titleData, endRows: infoData, sanitizeData };

    return returnData;
  }

  public sanitizeData({ employees }: { employees: EmployeeEntity[] }): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = [];


    employees.forEach((employee) => {
      const row: IReportSanitizeData = {
        cpf: { content: employee.cpf },
        name: { content: employee.name },
        email: { content: employee.email },
        phone: { content: employee.phone },
        birthday: { content: this.dayjsProvider.format(employee.birthday, 'DD/MM/YYYY') },
        admissionDate: { content: this.dayjsProvider.format(employee.admissionDate, 'DD/MM/YYYY') },
        demissionDate: { content: this.dayjsProvider.format(employee.demissionDate, 'DD/MM/YYYY') },
        socialName: { content: employee.socialName },
        sex: { content: employee.sex },
        esocialCode: { content: employee.esocialCode },
        isPCD: { content: employee.isPCD ? 'Sim' : 'Não' },
        lastExam: { content: this.dayjsProvider.format(employee.lastExam, 'DD/MM/YYYY') },
        rg: { content: employee.rg },
        directory: { content: employee.directory?.name },
        management: { content: employee.management?.name },
        sector: { content: employee.sector?.name },
        subSector: { content: employee.sub_sector?.name },
        office: { content: employee.office?.name },
        // subOffice: { content: employee.subOffices?. },
        cbo: { content: employee.cbo },
        officeDescription: { content: employee.hierarchy?.description },
        officeRealDescription: { content: employee.hierarchy?.realDescription },
        // gho: { content: employee.gho },
        // ghoDescription: { content: employee.ghoDescription },
      };

      rows.push(row);
    }
    );

    return rows;
  }

  public getFilename(company: CompanyEntity): string {
    const filename = `Funcionários (${company.fantasy || company.name})`;
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
