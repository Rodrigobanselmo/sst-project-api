import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import { JwtTokenProvider } from '../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';
import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let refreshTokensRepository: RefreshTokensRepository;
  let jwtTokenProvider: JwtTokenProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: RefreshTokensRepository,
          useValue: {
            findByUserIdAndRefreshToken: jest
              .fn()
              .mockResolvedValue({ id: 'uuid' }),
            create: jest.fn().mockResolvedValue({ refresh_token: 'string' }),
            deleteByRefreshToken: jest.fn().mockResolvedValue(undefined),
            deleteById: jest.fn().mockResolvedValue(undefined),
          } as Partial<RefreshTokensRepository>,
        },
        {
          provide: JwtTokenProvider,
          useValue: {
            generateToken: jest.fn().mockReturnValue('token'),
            generateRefreshToken: jest
              .fn()
              .mockReturnValue(['refresh_token', new Date()]),
            verifyIsValidToken: jest.fn().mockReturnValue(true),
          } as Partial<JwtTokenProvider>,
        },
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
      ],
    }).compile();

    jwtTokenProvider = module.get<JwtTokenProvider>(JwtTokenProvider);
    refreshTokensRepository = module.get<RefreshTokensRepository>(
      RefreshTokensRepository,
    );
    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token, refresh token and user', async () => {
    const newSession = await service.execute({} as any);

    expect(newSession).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        refresh_token: expect.any(String),
        user: expect.any(Object),
      }),
    );
  });

  it('should return error if token is invalid', async () => {
    jest
      .spyOn(jwtTokenProvider, 'verifyIsValidToken')
      .mockImplementation(() => 'invalid' as any);

    try {
      await service.execute({} as any);
      throw new Error('error');
    } catch (err) {
      expect(err).toEqual(new UnauthorizedException('invalid jwt'));
    }
  });

  it('should return error if token is expired', async () => {
    jest
      .spyOn(jwtTokenProvider, 'verifyIsValidToken')
      .mockImplementation(() => 'expired' as any);

    try {
      await service.execute({} as any);
      throw new Error('error');
    } catch (err) {
      expect(err).toEqual(new UnauthorizedException('jwt expired'));
    }
  });

  it('should return error if token does not exists in database', async () => {
    jest
      .spyOn(refreshTokensRepository, 'findByUserIdAndRefreshToken')
      .mockImplementation(() => null as any);

    try {
      await service.execute({} as any);
      throw new Error('error');
    } catch (err) {
      expect(err).toEqual(
        new UnauthorizedException('Refresh Token does not exists!'),
      );
    }
  });

  it('should return error if token does not exists in database', async () => {
    jest
      .spyOn(refreshTokensRepository, 'findByUserIdAndRefreshToken')
      .mockImplementation(() => null as any);

    try {
      await service.execute({} as any);
      throw new Error('error');
    } catch (err) {
      expect(err).toEqual(
        new UnauthorizedException('Refresh Token does not exists!'),
      );
    }
  });
});
