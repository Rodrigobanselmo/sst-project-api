import { Test, TestingModule } from '@nestjs/testing';
import { FindAllHierarchyService } from './find-all-hierarchies.service';

describe('FindAllHierarchyService', () => {
  let service: FindAllHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllHierarchyService],
    }).compile();

    service = module.get<FindAllHierarchyService>(FindAllHierarchyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
