import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';
import { FindByIdService } from './find-by-id.service';

describe('FindByIdService', () => {
  let service: FindByIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByIdService,
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
      ],
    }).compile();

    service = module.get<FindByIdService>(FindByIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
