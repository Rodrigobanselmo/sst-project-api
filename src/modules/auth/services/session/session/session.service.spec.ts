import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { JwtTokenProvider } from '../../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let usersRepository: UsersRepository;
  let hashProvider: HashProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: HashProvider,
          useValue: {
            createHash: jest.fn().mockResolvedValue('string'),
            compare: jest.fn().mockResolvedValue(true),
          } as Partial<HashProvider>,
        },
        {
          provide: JwtTokenProvider,
          useValue: {
            generateToken: jest.fn().mockReturnValue('token'),
            generateRefreshToken: jest
              .fn()
              .mockReturnValue(['refresh_token', new Date()]),
          } as Partial<JwtTokenProvider>,
        },
        {
          provide: RefreshTokensRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({ refresh_token: 'string' }),
          } as Partial<RefreshTokensRepository>,
        },
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    hashProvider = module.get<HashProvider>(HashProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token, refresh token and user', async () => {
    const session = await service.execute({} as any);

    expect(session).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        refresh_token: expect.any(String),
        user: expect.any(Object),
      }),
    );
  });

  it('should not return password', async () => {
    const session = await service.execute({} as any);
    expect(session.user.password).toBeUndefined();
  });

  it('should throw error if user does not exist', async () => {
    jest
      .spyOn(usersRepository, 'findByEmail')
      .mockImplementation(() => false as any);

    try {
      await service.execute({} as any);
      throw new Error('error');
    } catch (err) {
      expect(err).toEqual(
        new BadRequestException('Email or password incorrect'),
      );
    }
  });

  it('should throw error if password is invalid', async () => {
    jest.spyOn(hashProvider, 'compare').mockImplementation(() => false as any);

    try {
      await service.execute({} as any);
      throw new Error('error');
    } catch (err) {
      expect(err).toEqual(
        new BadRequestException('Email or password incorrect'),
      );
    }
  });
});
