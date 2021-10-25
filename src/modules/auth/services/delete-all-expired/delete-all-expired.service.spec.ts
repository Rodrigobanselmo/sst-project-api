import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAllExpiredService } from './delete-all-expired.service';

describe('DeleteAllExpiredRefreshTokensService', () => {
  let service: DeleteAllExpiredService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteAllExpiredService],
    }).compile();

    service = module.get<DeleteAllExpiredService>(DeleteAllExpiredService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
