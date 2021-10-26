import { Test, TestingModule } from '@nestjs/testing';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';
import { DeleteAllExpiredService } from './delete-all-expired.service';

describe('DeleteAllExpiredRefreshTokensService', () => {
  let service: DeleteAllExpiredService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteAllExpiredService,
        {
          provide: DayJSProvider,
          useValue: {
            dateNow: jest.fn().mockResolvedValue(new Date()),
          } as Partial<DayJSProvider>,
        },
        {
          provide: RefreshTokensRepository,
          useValue: {
            deleteAllOldTokens: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteAllExpiredService>(DeleteAllExpiredService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete all expired tokens', async () => {
    expect(await service.execute()).toEqual({});
  });
});
