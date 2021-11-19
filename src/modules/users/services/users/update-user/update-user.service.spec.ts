import { Test, TestingModule } from '@nestjs/testing';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { UpdateUserService } from './update-user.service';

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: HashProvider,
          useValue: {
            compare: jest.fn().mockResolvedValue(true),
            createHash: jest.fn().mockResolvedValue('string'),
          } as Partial<HashProvider>,
        },
        {
          provide: UsersRepository,
          useValue: {
            update: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
