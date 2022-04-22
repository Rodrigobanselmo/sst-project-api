import { Test, TestingModule } from '@nestjs/testing';
import { DeleteHomoGroupService } from './delete-homo-group.service';

describe.skip('DeleteHomoGroupService', () => {
  let service: DeleteHomoGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteHomoGroupService],
    }).compile();

    service = module.get<DeleteHomoGroupService>(DeleteHomoGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
