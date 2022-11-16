import { Test, TestingModule } from '@nestjs/testing';
import { UpdateGenerateSourceService } from './update-generate-source.service';

describe.skip('UpdateGenerateSourceService', () => {
  let service: UpdateGenerateSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateGenerateSourceService],
    }).compile();

    service = module.get<UpdateGenerateSourceService>(UpdateGenerateSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
