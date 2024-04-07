import { UserPayloadDto } from './../../../shared/dto/user-payload.dto';
import { User } from '../../../shared/decorators/user.decorator';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import _puppeteer from 'puppeteer';
import path from 'path';
import { Response } from 'express';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SendEmailService } from '../services/send-email.service';
import { EmailDto } from '../dto/email.dto';
import { CreateNotificationDto, FindNotificationDto, UpdateUserNotificationDto } from '../dto/nofication.dto';
import { ListNotificationService } from '../services/list-notification.service';
import { CreateNotificationService } from '../services/create-notification.service';
import { ListCompanyNotificationService } from '../services/list-company-notification.service';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { RoleEnum } from '../../../shared/constants/enum/authorization';
import { UpdateUserNotificationService } from '../services/update-user-notification.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { simulateAwait } from 'src/shared/utils/simulateAwait';
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly listNotificationService: ListNotificationService,
    private readonly createNotificationService: CreateNotificationService,
    private readonly listCompanyNotificationService: ListCompanyNotificationService,
    private readonly updateUserNotificationService: UpdateUserNotificationService,
  ) { }

  @Roles(RoleEnum.NOTIFICATION)
  @Post()
  sendNotification(@User() user: UserPayloadDto, @Body() dto: CreateNotificationDto) {
    return this.createNotificationService.execute(user, dto);
  }

  @Post('email')
  @UseInterceptors(FilesInterceptor('files[]', 5))
  sendEmail(@User() user: UserPayloadDto, @Body() dto: EmailDto, @UploadedFiles() files?: Array<Express.Multer.File>) {
    return this.sendEmailService.execute(user, dto, files);
  }

  @Patch(':id/user')
  updateUser(@User() user: UserPayloadDto, @Body() dto: UpdateUserNotificationDto, @Param('id', ParseIntPipe) id: number) {
    return this.updateUserNotificationService.execute(user, { ...dto, id });
  }

  @Get()
  listNotification(@User() user: UserPayloadDto, @Query() query: FindNotificationDto) {
    return this.listNotificationService.execute(user, query);
  }

  @Roles(RoleEnum.NOTIFICATION)
  @Get('company')
  listCompanyNotification(@User() user: UserPayloadDto, @Query() query: FindNotificationDto) {
    return this.listCompanyNotificationService.execute(user, query);
  }

  @Public()
  @Get('returnfile')
  async returnFile2(@Res() res: Response) {
    const filePath = path.join(__dirname, '../../../../../tmp/Dockerfile');
    const fileName = 'Dockerfile';

    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    // res.setHeader('Content-Type', '');

    res.download(filePath, fileName);
  }

  @Public()
  @Get('teste')
  async teste() {
    const companySearch = '09.336.044/0001-61'
    const username = 'alex@realizaconsultoria.com.br'
    const password = ''

    const usernameSimple = 'admin@simple.com'
    const passwordSimple = ''

    const rsdataLoginUrl = 'https://apps.rsdata.com.br/dataSEESMT/login.jsf'
    const rsdataEmplooyeListUrl = 'https://apps.rsdata.com.br/dataSEESMT/cargos/listagemEmpregados/empregados-lista.jsf'

    const simpleLoginUrl = 'http://localhost:3000/'

    const puppeteer = _puppeteer as any

    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 20,
    });

    const page = await browser.newPage();

    {
      const client = await page.createCDPSession()
      const downloadPath = path.join(__dirname, '../../../../../tmp');
      
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
      });
    }

    {
      await page.goto(simpleLoginUrl, {});
      await page.evaluate(() => (document as any).querySelector('#input_email').value = '');
      await page.evaluate(() => (document as any).querySelector('#input_password').value = '');
      
      await page.type('#input_email', usernameSimple);
      await page.type('#input_password', passwordSimple);

      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    }

    return { ok: true };


    ////- - -- - -- - - -- - -
    {
      await page.goto(rsdataLoginUrl);
      await page.evaluate(() => (document as any).querySelector('#j_username').value = '');
      await page.evaluate(() => (document as any).querySelector('#j_password').value = '');
      
      await page.type('#j_username', username);
      await page.type('#j_password', password);
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    }

    {
      await page.goto(rsdataEmplooyeListUrl, {});
      
      const searchCompanyInputSelector = '#form\\:autoCompleteEmpresa\\:autoCompleteEmpresa_input';
      await page.focus(searchCompanyInputSelector);
      await page.evaluate(() => (document as any).getElementById('form:autoCompleteEmpresa:autoCompleteEmpresa_input').value = '');
      await page.type(searchCompanyInputSelector, companySearch);
      
      const searchItemCardSelector = 'tr.ui-autocomplete-item[data-item-value="key_1"]'
      await page.waitForSelector(searchItemCardSelector, { timeout: 10000 });
      await page.click(searchItemCardSelector);
      
      await page.waitForSelector('#config', { timeout: 10000 });
      await page.click('#config');
      await page.click('#form\\:config\\:j_idt408');
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    }



    await browser.close();

    return { ok: true };
  }
}
