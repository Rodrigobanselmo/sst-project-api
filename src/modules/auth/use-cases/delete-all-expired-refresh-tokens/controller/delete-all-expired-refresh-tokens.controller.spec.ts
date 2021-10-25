import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAllExpiredRefreshTokensController } from './delete-all-expired-refresh-tokens.controller';

describe('DeleteAllExpiredRefreshTokensController', () => {
  let controller: DeleteAllExpiredRefreshTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteAllExpiredRefreshTokensController],
    }).compile();

    controller = module.get<DeleteAllExpiredRefreshTokensController>(
      DeleteAllExpiredRefreshTokensController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
