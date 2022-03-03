import { Controller, Get } from '@nestjs/common';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';

@Controller('files')
export class FilesController {
  @Get('/database-tables')
  findAllTables() {
    return Object.values(workbooksConstant).map((item) => ({
      ...item,
    }));
  }
}
