import { Test, TestingModule } from '@nestjs/testing';
import { FindByTokenService } from './find-by-token.service';

describe('FindByTokenService', () => {
  let service: FindByTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindByTokenService],
    }).compile();

    service = module.get<FindByTokenService>(FindByTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
