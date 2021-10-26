import { Test, TestingModule } from '@nestjs/testing';

import { HashProvider } from '../../../../shared/providers/HashProvider/implementations/HashProvider';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';
import { CreateUserService } from './create-user.service';

describe('CreateUserService', () => {
  let service: CreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
        {
          provide: HashProvider,
          useValue: {
            createHash: jest.fn().mockResolvedValue('string'),
          } as Partial<HashProvider>,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return created user', async () => {
    const user = await service.execute({ password: '123456' } as any);
    expect(user).toEqual({});
  });
});
