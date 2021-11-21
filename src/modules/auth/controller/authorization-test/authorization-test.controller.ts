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
  @Get()
  route1() {
    return true;
  }

  @Permissions(
    {
      code: Permission.USER,
      crud: true,
    },
    {
      code: Permission.INVITE_USER,
      checkCompany: true,
    },
    {
      code: Permission.CREATE_COMPANY,
      crud: true,
      checkCompany: true,
    },
  )
  @Post()
  route2() {
    return true;
  }

  @Permissions({
    code: Permission.CREATE_COMPANY,
    crud: true,
    checkCompany: true,
  })
  @Post('2')
  route21() {
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
  route3() {
    return true;
  }

  @Permissions(
    {
      code: Permission.INVITE_USER,
      crud: true,
    },
    {
      code: Permission.CREATE_COMPANY,
      checkChild: true,
    },
  )
  @Delete()
  route4() {
    return true;
  }
}
