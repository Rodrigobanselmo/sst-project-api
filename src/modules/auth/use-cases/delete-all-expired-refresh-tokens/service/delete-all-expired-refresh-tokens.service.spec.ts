import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAllExpiredRefreshTokensService } from './delete-all-expired-refresh-tokens.service';

describe('DeleteAllExpiredRefreshTokensService', () => {
  let service: DeleteAllExpiredRefreshTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteAllExpiredRefreshTokensService],
    }).compile();

    service = module.get<DeleteAllExpiredRefreshTokensService>(
      DeleteAllExpiredRefreshTokensService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
