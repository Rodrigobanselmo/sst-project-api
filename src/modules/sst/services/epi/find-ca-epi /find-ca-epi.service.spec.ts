import { Test, TestingModule } from "@nestjs/testing";
import { FindByCAEpiService } from "./find-ca-epi.service";

describe.skip("FindCAEpiService", () => {
  let service: FindByCAEpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindByCAEpiService],
    }).compile();

    service = module.get<FindByCAEpiService>(FindByCAEpiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
