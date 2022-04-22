import { Test, TestingModule } from '@nestjs/testing';
import { CreateGenerateSourceService } from './create-generate-source.service';

describe.skip('CreateGenerateSourceService', () => {
  let service: CreateGenerateSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateGenerateSourceService],
    }).compile();

    service = module.get<CreateGenerateSourceService>(
      CreateGenerateSourceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
