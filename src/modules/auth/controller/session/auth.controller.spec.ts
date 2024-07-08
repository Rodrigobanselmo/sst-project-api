import { Test, TestingModule } from "@nestjs/testing";
import { DeleteAllExpiredService } from "../../services/session/delete-all-expired/delete-all-expired.service";
import { RefreshTokenService } from "../../services/session/refresh-token/refresh-token.service";
import { SendForgotPassMailService } from "../../services/session/send-forgot-pass-mail/send-forgot-pass-mail.service";
import { SessionService } from "../../services/session/session/session.service";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RefreshTokenService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: SessionService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: DeleteAllExpiredService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: SendForgotPassMailService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should authenticate user session", async () => {
    expect(await controller.session({} as any, {} as any, {} as any)).toEqual(
      {}
    );
  });

  it("should refresh user token", async () => {
    expect(await controller.refresh({} as any)).toEqual({});
  });

  it("should delete all expired tokens", async () => {
    expect(await controller.deleteAll()).toEqual({});
  });
});
