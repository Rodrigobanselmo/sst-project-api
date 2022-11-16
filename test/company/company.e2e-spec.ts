import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { LoginUserDto } from '../../src/modules/auth/dto/login-user.dto';
import { CompanyModule } from '../../src/modules/company/company.module';
import { UsersModule } from '../../src/modules/users/users.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaDbExceptionFilter } from '../../src/shared/filters/prisma-db-exception.filter';
import { JwtAuthGuard } from '../../src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../src/shared/guards/permissions.guard';
import { RolesGuard } from '../../src/shared/guards/roles.guard';
import { FakeWorkspace } from '../utils/fake/workspace.fake';
import { FakeCompany } from './../utils/fake/company.fake';
import { User } from '.prisma/client';

// import { FakeInvite } from '../utils/fake/invite.fake';
// import { FakerUser } from '../utils/fake/user.fake';

describe('[Feature] Company - /company', () => {
  let app: INestApplication;
  let sessionAdmin: { token: string; user: User; refresh_token: string };
  // const user = new FakerUser();
  // delete user.token;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UsersModule, AuthModule, CompanyModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        {
          provide: APP_GUARD,
          useClass: PermissionsGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new PrismaDbExceptionFilter());
    await app.init();

    // await request(app.getHttpServer()).post('/users').send(user);
    const sessionUser: LoginUserDto = {
      email: 'admin@simple.com',
      password: '12345678',
    };

    const data = await request(app.getHttpServer()).post('/session').send(sessionUser);

    sessionAdmin = data.body;
  });

  describe('Create [POST]', () => {
    it('should not create company without workspace', async () => {
      const createCompany = new FakeCompany();

      return await request(app.getHttpServer()).post('/company').set('Authorization', `Bearer ${sessionAdmin.token}`).send(createCompany).expect(HttpStatus.BAD_REQUEST);
    });

    it('should create company', async () => {
      const createCompany = new FakeCompany();
      createCompany.pushWorkspace(new FakeWorkspace());

      const { body: company } = await request(app.getHttpServer())
        .post('/company')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send(createCompany)
        .expect(HttpStatus.CREATED);

      expect(company).toHaveProperty('id');
      expect(company.license).toHaveProperty('id');
      return expect(company.workspace.length).toEqual(1);
    });
  });

  // it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
