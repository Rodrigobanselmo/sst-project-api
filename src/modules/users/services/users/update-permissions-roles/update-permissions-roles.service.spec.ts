import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePermissionsRolesService } from './update-permissions-roles.service';

describe('UpdatePermissionsRolesService', () => {
  let service: UpdatePermissionsRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatePermissionsRolesService],
    }).compile();

    service = module.get<UpdatePermissionsRolesService>(
      UpdatePermissionsRolesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
