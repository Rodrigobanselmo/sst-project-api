import { Test, TestingModule } from '@nestjs/testing';
import { CreateHierarchyService } from './create-hierarchies.service';

describe('UpsertHierarchyService', () => {
  let service: CreateHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateHierarchyService],
    }).compile();

    service = module.get<CreateHierarchyService>(CreateHierarchyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
