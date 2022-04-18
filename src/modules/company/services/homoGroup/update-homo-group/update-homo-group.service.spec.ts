import { Test, TestingModule } from '@nestjs/testing';
import { UpdateHomoGroupService } from './update-homo-group.service';

describe('UpsertHierarchyService', () => {
  let service: UpdateHomoGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateHomoGroupService],
    }).compile();

    service = module.get<UpdateHomoGroupService>(UpdateHomoGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
