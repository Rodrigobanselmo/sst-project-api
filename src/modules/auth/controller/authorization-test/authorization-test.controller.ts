import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';

@Controller('authorization-test')
export class AuthorizationTestController {
  @Permissions(
    {
      code: PermissionEnum.USER,
      crud: true,
    },
    {
      code: PermissionEnum.USER,
    },
  )
  @Get()
  route1() {
    return true;
  }

  @Permissions(
    {
      code: PermissionEnum.USER,
      crud: true,
    },
    {
      code: PermissionEnum.USER,
      isMember: true,
    },
    {
      code: PermissionEnum.CREATE_COMPANY,
      crud: true,
      isMember: true,
    },
  )
  @Post()
  route2() {
    return true;
  }

  @Permissions({
    code: PermissionEnum.CREATE_COMPANY,
    crud: true,
    isMember: true,
  })
  @Post('2')
  route21() {
    return true;
  }

  @Permissions(
    {
      code: PermissionEnum.USER,
      crud: true,
    },
    {
      code: PermissionEnum.USER,
      crud: true,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.CREATE_COMPANY,
      crud: true,
      isContract: true,
    },
  )
  @Patch()
  route3() {
    return true;
  }

  @Permissions({
    code: PermissionEnum.USER,
    crud: true,
  })
  @Delete()
  route4() {
    return true;
  }

  @Permissions({
    isMember: true,
  })
  @Get('6')
  route6() {
    return true;
  }

  @Permissions({
    isContract: true,
  })
  @Get('7')
  route7() {
    return true;
  }

  @Permissions({
    code: PermissionEnum.CREATE_COMPANY,
    isContract: true,
  })
  @Get('8')
  route8() {
    return true;
  }
}
