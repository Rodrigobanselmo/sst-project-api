import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';
import { FindByEmailService } from './find-by-email.service';

describe('FindByEmailService', () => {
  let service: FindByEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByEmailService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
      ],
    }).compile();

    service = module.get<FindByEmailService>(FindByEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
