import { Test, TestingModule } from '@nestjs/testing';
import { UpsertManyHierarchyService } from './upsert-many-hierarchies.service';

describe.skip('UpsertHierarchyService', () => {
  let service: UpsertManyHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpsertManyHierarchyService],
    }).compile();

    service = module.get<UpsertManyHierarchyService>(
      UpsertManyHierarchyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
