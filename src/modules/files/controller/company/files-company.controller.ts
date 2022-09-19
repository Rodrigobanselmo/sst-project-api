import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { DownloadCompaniesService } from '../../services/company/download-companies/download-companies.service';
import { DownloadEmployeesService } from '../../services/company/download-employees/download-employees.service';
import { DownloadHierarchiesService } from '../../services/company/download-hierarchies/download-hierarchies.service';
import { DownloadUniqueCompanyService } from '../../services/company/download-unique-company/download-unique-company.service';
import { UploadCompaniesService } from '../../services/company/upload-companies/upload-companies.service';
import { UploadEmployeesService } from '../../services/company/upload-employees/upload-employees.service';
import { UploadHierarchiesService } from '../../services/company/upload-hierarchies/upload-hierarchies.service';
import { UploadUniqueCompanyService } from '../../services/company/upload-unique-company/upload-unique-company.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import {
  PermissionEnum,
  RoleEnum,
} from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
@Controller('files/company')
export class FilesCompanyController {
  constructor(
    private readonly downloadCompaniesService: DownloadCompaniesService,
    private readonly uploadCompaniesService: UploadCompaniesService,
    private readonly downloadUniqueCompanyService: DownloadUniqueCompanyService,
    private readonly uploadUniqueCompanyService: UploadUniqueCompanyService,
    private readonly uploadEmployeesService: UploadEmployeesService,
    private readonly downloadEmployeesService: DownloadEmployeesService,
    private readonly uploadHierarchiesService: UploadHierarchiesService,
    private readonly downloadHierarchiesService: DownloadHierarchiesService,
  ) {}

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Post('/upload/unique')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCompanyFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } =
      await this.uploadUniqueCompanyService.execute(file, userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE, RoleEnum.MANAGEMENT)
  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
  })
  @Post('employees/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEmployeesFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } = await this.uploadEmployeesService.execute(
      file,
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE, RoleEnum.MANAGEMENT)
  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('hierarchies/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadHierarchiesFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    await this.uploadHierarchiesService.execute(file, userPayloadDto);
    return 'sucesso';
  }

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } = await this.uploadCompaniesService.execute(
      file,
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Get('/download/:companyId?')
  async download(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadCompaniesService.execute(
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Get('/download/unique/:companyId?')
  async downloadUnique(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } =
      await this.downloadUniqueCompanyService.execute(userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
  })
  @Get('/employees/download/:companyId?')
  async downloadEmployees(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadEmployeesService.execute(
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
  })
  @Get('/hierarchies/download/:companyId?')
  async downloadHierarchies(
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } =
      await this.downloadHierarchiesService.execute(userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }
}
