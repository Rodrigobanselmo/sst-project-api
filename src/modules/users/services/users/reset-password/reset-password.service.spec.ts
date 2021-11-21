import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokensRepository } from '../../../../auth/repositories/implementations/RefreshTokensRepository';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { ResetPasswordService } from './reset-password.service';

describe('ResetPasswordService', () => {
  let service: ResetPasswordService;
  let refreshTokensRepository: RefreshTokensRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        {
          provide: UsersRepository,
          useValue: {
            update: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
        {
          provide: RefreshTokensRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue({ userId: 'uuid' }),
          } as Partial<RefreshTokensRepository>,
        },
        {
          provide: HashProvider,
          useValue: {
            createHash: jest.fn().mockResolvedValue('string'),
          } as Partial<HashProvider>,
        },
      ],
    }).compile();

    refreshTokensRepository = module.get<RefreshTokensRepository>(
      RefreshTokensRepository,
    );
    service = module.get<ResetPasswordService>(ResetPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user with new password', async () => {
    const user = await service.execute({
      tokenId: 'uuid',
      password: '123',
    });
    expect(user).toEqual({});
  });
  it('should return error if token not found', async () => {
    jest
      .spyOn(refreshTokensRepository, 'findById')
      .mockImplementation(() => null as any);

    try {
      await service.execute({} as any);
      throw new Error('error');
    } catch (err) {
      expect(err).toEqual(new BadRequestException('Token not found'));
    }
  });
});
