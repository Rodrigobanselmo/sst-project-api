import { Test, TestingModule } from '@nestjs/testing';
import { DeleteExpiredInvitesService } from './delete-expired-invites.service';

describe('DeleteExpiredInvitesService', () => {
  let service: DeleteExpiredInvitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteExpiredInvitesService],
    }).compile();

    service = module.get<DeleteExpiredInvitesService>(DeleteExpiredInvitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
