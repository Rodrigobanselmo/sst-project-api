import { Test, TestingModule } from '@nestjs/testing';
import { CreateHomoGroupService } from './create-homo-group.service';

describe.skip('UpsertHierarchyService', () => {
  let service: CreateHomoGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateHomoGroupService],
    }).compile();

    service = module.get<CreateHomoGroupService>(CreateHomoGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
