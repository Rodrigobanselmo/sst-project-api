import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';

import { Permission } from '../../../../shared/constants/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';

@Controller('authorization-test')
export class AuthorizationTestController {
  @Permissions(
    {
      code: Permission.USER,
      crud: true,
    },
    {
      code: Permission.INVITE_USER,
    },
  )
  @Get('1')
  permissions1() {
    return true;
  }

  @Permissions(
    {
      code: Permission.USER,
      crud: true,
    },
    {
      code: Permission.INVITE_USER,
      crud: true,
      checkCompany: true,
    },
  )
  @Post()
  permissions2() {
    return true;
  }

  @Permissions(
    {
      code: Permission.USER,
      crud: true,
    },
    {
      code: Permission.INVITE_USER,
      crud: true,
      checkCompany: true,
      checkChild: true,
    },
    {
      code: Permission.CREATE_COMPANY,
      crud: true,
      checkChild: true,
    },
  )
  @Patch()
  permissions3() {
    return true;
  }

  @Permissions({
    code: Permission.INVITE_USER,
    crud: true,
  })
  @Delete()
  permissions4() {
    return true;
  }
}
