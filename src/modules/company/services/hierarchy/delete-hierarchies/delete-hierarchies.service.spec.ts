import { Test, TestingModule } from '@nestjs/testing';
import { DeleteHierarchyService } from './delete-hierarchies.service';

describe('DeleteHierarchyService', () => {
  let service: DeleteHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteHierarchyService],
    }).compile();

    service = module.get<DeleteHierarchyService>(DeleteHierarchyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
