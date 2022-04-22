import { Test, TestingModule } from '@nestjs/testing';
import { UpdateHierarchyService } from './update-hierarchies.service';

describe.skip('UpsertHierarchyService', () => {
  let service: UpdateHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateHierarchyService],
    }).compile();

    service = module.get<UpdateHierarchyService>(UpdateHierarchyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
