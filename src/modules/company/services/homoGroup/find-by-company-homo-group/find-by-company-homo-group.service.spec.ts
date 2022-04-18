import { Test, TestingModule } from '@nestjs/testing';
import { FindByCompanyHomoGroupService } from './find-by-company-homo-group.service';

describe('FindByCompanyHomoGroupService', () => {
  let service: FindByCompanyHomoGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindByCompanyHomoGroupService],
    }).compile();

    service = module.get<FindByCompanyHomoGroupService>(
      FindByCompanyHomoGroupService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
