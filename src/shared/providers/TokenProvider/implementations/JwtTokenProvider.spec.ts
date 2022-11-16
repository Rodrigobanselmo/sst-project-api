import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import { JwtTokenProvider } from './JwtTokenProvider';

describe('JwtTokenProvider', () => {
  let jwtTokenProvider: JwtTokenProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenProvider,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn((token, options) => {
              if (token === 'expired') throw new Error('jwt expired');
              if (token !== options.secret) throw new Error('invalid signature');

              return { sub: 'userId' };
            }),
          } as Partial<JwtService>,
        },
        {
          provide: DayJSProvider,
          useValue: {
            dateNow: jest.fn().mockReturnValue(new Date()),
            addTime: jest.fn().mockReturnValue(new Date(2020, 1, 1)),
          } as Partial<DayJSProvider>,
        },
      ],
    }).compile();

    jwtTokenProvider = module.get<JwtTokenProvider>(JwtTokenProvider);
  });

  it('should be defined', () => {
    expect(jwtTokenProvider).toBeDefined();
  });

  it('should generate token', () => {
    expect(jwtTokenProvider.generateToken({} as any)).toEqual('token');
  });

  it('should generate refresh token and refresh token expiration date', () => {
    expect(jwtTokenProvider.generateRefreshToken({} as any)).toEqual(['token', new Date(2020, 1, 1)]);
  });

  it('should verify a valid token', () => {
    // process.env.SECRET_TOKEN = secret
    const sub = jwtTokenProvider.verifyIsValidToken('secret');
    expect(sub).toEqual('userId');
  });

  it('should verify a valid refresh-token', () => {
    // process.env.SECRET_REFRESH_TOKEN = secret_token
    const sub = jwtTokenProvider.verifyIsValidToken('secret_token', 'refresh');

    expect(sub).toEqual('userId');
  });

  it('should return invalid if is an invalid token', () => {
    const sub = jwtTokenProvider.verifyIsValidToken('wrong_secret');
    expect(sub).toEqual('invalid');
  });

  it('should return expired if is an expired token', () => {
    const sub = jwtTokenProvider.verifyIsValidToken('expired');

    expect(sub).toEqual('expired');
  });
});
