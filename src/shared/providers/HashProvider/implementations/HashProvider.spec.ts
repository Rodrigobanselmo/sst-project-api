import { Test, TestingModule } from '@nestjs/testing';
import { HashProvider } from './HashProvider';

describe.skip('HashProvider', () => {
  let hashProvider: HashProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashProvider],
    }).compile();

    hashProvider = module.get<HashProvider>(HashProvider);
  });

  it('should be defined', () => {
    expect(hashProvider).toBeDefined();
  });

  it('should return a hash string (createHash)', async () => {
    expect(await hashProvider.createHash('123456')).toEqual(expect.any(String));
  });

  it('should compare hash to correct password and return true', async () => {
    const hash = await hashProvider.createHash('123456');
    expect(await hashProvider.compare('123456', hash)).toEqual(true);
  });

  it('should compare hash to wrong password and return false', async () => {
    const hash = await hashProvider.createHash('12345678');
    expect(await hashProvider.compare('123456', hash)).toEqual(false);
  });
});
