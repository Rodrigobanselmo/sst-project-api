import { Test, TestingModule } from '@nestjs/testing';
import { InviteUsersService } from './invite-users.service';

describe('InviteUsersService', () => {
  let service: InviteUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteUsersService],
    }).compile();

    service = module.get<InviteUsersService>(InviteUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
