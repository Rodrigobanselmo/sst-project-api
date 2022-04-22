import { Test, TestingModule } from '@nestjs/testing';
import { DeleteInvitesService } from './delete-invites.service';

describe.skip('DeleteInvitesService', () => {
  let service: DeleteInvitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteInvitesService],
    }).compile();

    service = module.get<DeleteInvitesService>(DeleteInvitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
