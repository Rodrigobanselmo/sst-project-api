import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserCompanyDto } from 'src/modules/users/dto/update-user-company.dto';
import request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { CompanyModule } from '../../src/modules/company/company.module';
import { CompanyEntity } from '../../src/modules/company/entities/company.entity';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { InviteUserDto } from '../../src/modules/users/dto/invite-user.dto';
import { UserEntity } from '../../src/modules/users/entities/user.entity';
import { UsersModule } from '../../src/modules/users/users.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { Permission } from '../../src/shared/constants/authorization';
import { PrismaDbExceptionFilter } from '../../src/shared/filters/prisma-db-exception.filter';
import { JwtAuthGuard } from '../../src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../src/shared/guards/permissions.guard';
import { RolesGuard } from '../../src/shared/guards/roles.guard';
import { FakeCompany } from '../utils/fake/company.fake';
import { FakeInvite } from '../utils/fake/invite.fake';
import { FakerUser } from '../utils/fake/user.fake';
import { FakeWorkspace } from '../utils/fake/workspace.fake';
import { User } from '.prisma/client';

const createToken = async (
  app: INestApplication,
  token: string,
  options?: Partial<InviteUserDto>,
) => {
  const createInvite = new FakeInvite(options);

  const { body: invite } = await request(app.getHttpServer())
    .post('/invites')
    .send(createInvite)
    .set('Authorization', `Bearer ${token}`)
    .expect(HttpStatus.CREATED);

  return invite;
};

const createSession = async (
  app: INestApplication,
  email = 'admin@simple.com',
  password = '12345678',
) => {
  const { body } = await request(app.getHttpServer())
    .post('/session')
    .send({ email, password })
    .expect(HttpStatus.OK);

  return body;
};

const createUser = async (
  app: INestApplication,
  options?: Partial<CreateUserDto>,
) => {
  const createUser = new FakerUser(options);
  if (!createUser.token) delete createUser.token;

  const { body: bodyUser } = await request(app.getHttpServer())
    .post('/users')
    .send(createUser)
    .expect(HttpStatus.CREATED);

  return bodyUser as UserEntity;
};

const editUsersRoles = async (
  app: INestApplication,
  token: string,
  options: UpdateUserCompanyDto,
) => {
  const { body } = await request(app.getHttpServer())
    .patch(`/users/update/authorization`)
    .set('Authorization', `Bearer ${token}`)
    .send(options)
    .expect(HttpStatus.OK);

  const user = body as UserEntity;
  const session = await createSession(app, user.email, '12345678');

  return session as { token: string; user: User; refresh_token: string };
};

const createCompany = async (app: INestApplication, token: string) => {
  const createCompany = new FakeCompany();
  createCompany.pushWorkspace(new FakeWorkspace());

  const { body: bodyCompany } = await request(app.getHttpServer())
    .post('/company')
    .set('Authorization', `Bearer ${token}`)
    .send(createCompany)
    .expect(HttpStatus.CREATED);

  return bodyCompany as CompanyEntity;
};

const createContract = async (
  app: INestApplication,
  token: string,
  companyId: string,
) => {
  const createCompany = new FakeCompany();
  createCompany.pushWorkspace(new FakeWorkspace());

  const { body: bodyCompany } = await request(app.getHttpServer())
    .post('/company/contract')
    .set('Authorization', `Bearer ${token}`)
    .send({ companyId: companyId, ...createCompany })
    .expect(HttpStatus.CREATED);

  return bodyCompany as CompanyEntity;
};

describe('[Feature] Authorization', () => {
  let app: INestApplication;
  let sessionAdmin: { token: string; user: User; refresh_token: string };
  let sessionMain: { token: string; user: User; refresh_token: string };
  let sessionContract: { token: string; user: User; refresh_token: string };
  let companyMain: CompanyEntity;
  let companyContract: CompanyEntity;
  let userMain: UserEntity;
  let userContract: UserEntity;

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

    // session admin
    sessionAdmin = await createSession(app);

    // create new company main
    companyMain = await createCompany(app, sessionAdmin.token);

    // create new user from company main
    const invite = await createToken(app, sessionAdmin.token, {
      companyId: companyMain.id,
    });

    userMain = await createUser(app, { token: invite.id, email: invite.email });

    // create new company contract
    companyContract = await createContract(
      app,
      sessionAdmin.token,
      companyMain.id,
    );

    // create new user from company contract
    const inviteContract = await createToken(app, sessionAdmin.token, {
      companyId: companyContract.id,
      permissions: [],
      roles: [],
    });

    userContract = await createUser(app, {
      token: inviteContract.id,
      email: inviteContract.email,
    });

    sessionMain = await createSession(app, userMain.email, '12345678');
    sessionContract = await createSession(app, userContract.email, '12345678');
  });

  describe('Permissions And Roles [All]', () => {
    it('should not be able to access without permissions', async () => {
      return await request(app.getHttpServer())
        .get('/authorization-test')
        .set('Authorization', `Bearer ${sessionContract.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should be able to have master access', async () => {
      return await request(app.getHttpServer())
        .get('/authorization-test')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .expect(HttpStatus.OK);
    });

    it('should be able to access only with permission', async () => {
      return await request(app.getHttpServer())
        .get('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .expect(HttpStatus.OK);
    });

    it('should be able to access with crud on get', async () => {
      const invite = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.USER}-cud`],
      });

      const user = await createUser(app, {
        token: invite.id,
        email: invite.email,
      });

      const session = await createSession(app, user.email, '12345678');

      await request(app.getHttpServer())
        .get('/authorization-test')
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.FORBIDDEN);

      const newSession = await editUsersRoles(app, sessionAdmin.token, {
        companyId: companyMain.id,
        userId: user.id,
        permissions: [`${Permission.USER}-r`],
        roles: [],
      });

      return await request(app.getHttpServer())
        .get('/authorization-test')
        .set('Authorization', `Bearer ${newSession.token}`)
        .expect(HttpStatus.OK);
    });

    it('should be able to access with crud on post', async () => {
      await request(app.getHttpServer())
        .post('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .expect(HttpStatus.FORBIDDEN);

      const invite = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.USER}-c`],
      });

      const user = await createUser(app, {
        token: invite.id,
        email: invite.email,
      });

      const session = await createSession(app, user.email, '12345678');

      return await request(app.getHttpServer())
        .post('/authorization-test')
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.CREATED);
    });

    it('should be able to access only with same company', async () => {
      const invite = await createToken(app, sessionAdmin.token, {
        companyId: companyContract.id,
      });

      const user = await createUser(app, {
        token: invite.id,
        email: invite.email,
      });

      const sessionContract = await createSession(app, user.email, '12345678');

      await request(app.getHttpServer())
        .post('/authorization-test')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send({ companyId: companyMain.id })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post('/authorization-test')
        .set('Authorization', `Bearer ${sessionContract.token}`)
        .send({ companyId: companyMain.id })
        .expect(HttpStatus.FORBIDDEN);

      return await request(app.getHttpServer())
        .post('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .send({ companyId: companyMain.id })
        .expect(HttpStatus.CREATED);
    });

    it('should be able to access only with same company and crud', async () => {
      const invite = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.CREATE_COMPANY}-c`],
      });

      const user = await createUser(app, {
        token: invite.id,
        email: invite.email,
      });

      const inviteFail = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`5-c`],
      });

      const userFail = await createUser(app, {
        token: inviteFail.id,
        email: inviteFail.email,
      });

      const sessionFail = await createSession(app, userFail.email, '12345678');
      const session = await createSession(app, user.email, '12345678');

      await request(app.getHttpServer())
        .post('/authorization-test/2')
        .set('Authorization', `Bearer ${sessionFail.token}`)
        .send({ companyId: companyMain.id })
        .expect(HttpStatus.FORBIDDEN);

      await request(app.getHttpServer())
        .post('/authorization-test/2')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send({ companyId: companyMain.id })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post('/authorization-test/2')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .send({ companyId: companyMain.id })
        .expect(HttpStatus.FORBIDDEN);

      return await request(app.getHttpServer())
        .post('/authorization-test/2')
        .set('Authorization', `Bearer ${session.token}`)
        .send({ companyId: companyMain.id })
        .expect(HttpStatus.CREATED);
    });

    it('should be able to access with crud on patch', async () => {
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .expect(HttpStatus.FORBIDDEN);

      const invite = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.USER}-u`],
      });

      const user = await createUser(app, {
        token: invite.id,
        email: invite.email,
      });

      const session = await createSession(app, user.email, '12345678');

      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .expect(HttpStatus.OK);

      return await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.OK);
    });

    it('should be able to access only with company or contract', async () => {
      const inviteContractOK = await createToken(app, sessionAdmin.token, {
        companyId: companyContract.id,
        permissions: [`${Permission.INVITE_USER}-crud`],
      });

      const userContractOK = await createUser(app, {
        token: inviteContractOK.id,
        email: inviteContractOK.email,
      });

      const sessionContractOK = await createSession(
        app,
        userContractOK.email,
        '12345678',
      );

      const inviteMainOK = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.INVITE_USER}-crud`],
      });

      const userMainOK = await createUser(app, {
        token: inviteMainOK.id,
        email: inviteMainOK.email,
      });

      const sessionMainOK = await createSession(
        app,
        userMainOK.email,
        '12345678',
      );

      const companyMain2 = await createCompany(app, sessionAdmin.token);

      const inviteMain2 = await createToken(app, sessionAdmin.token, {
        companyId: companyMain2.id,
        permissions: [`${Permission.INVITE_USER}-crud`],
      });

      const userMain2 = await createUser(app, {
        token: inviteMain2.id,
        email: inviteMain2.email,
      });

      const sessionMain2 = await createSession(
        app,
        userMain2.email,
        '12345678',
      );

      // admin ok
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      // contract same company and permissions ok
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionContractOK.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      // fail for same company but missing permission
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionContract.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      // fail for not parent company with permission
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain2.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      // parent ok
      return await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionMainOK.token}`)
        .send({ companyId: companyContract.id, myCompanyId: companyMain.id })
        .expect(HttpStatus.OK);
    });

    it('should be able to access only with contract and crud', async () => {
      const inviteContractOK = await createToken(app, sessionAdmin.token, {
        companyId: companyContract.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userContractOK = await createUser(app, {
        token: inviteContractOK.id,
        email: inviteContractOK.email,
      });

      const sessionContractOK = await createSession(
        app,
        userContractOK.email,
        '12345678',
      );

      const inviteMainOK = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userMainOK = await createUser(app, {
        token: inviteMainOK.id,
        email: inviteMainOK.email,
      });

      const sessionMainOK = await createSession(
        app,
        userMainOK.email,
        '12345678',
      );

      const companyMain2 = await createCompany(app, sessionAdmin.token);

      const inviteMain2 = await createToken(app, sessionAdmin.token, {
        companyId: companyMain2.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userMain2 = await createUser(app, {
        token: inviteMain2.id,
        email: inviteMain2.email,
      });

      const sessionMain2 = await createSession(
        app,
        userMain2.email,
        '12345678',
      );

      // admin ok
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      // contract same company and permissions ok
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionContractOK.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      // fail for same company but missing permission
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionContract.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      // fail for not parent company with permission
      await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain2.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      // parent ok
      return await request(app.getHttpServer())
        .patch('/authorization-test')
        .set('Authorization', `Bearer ${sessionMainOK.token}`)
        .send({ companyId: companyContract.id, myCompanyId: companyMain.id })
        .expect(HttpStatus.OK);
    });

    it('should be able to access with crud on delete', async () => {
      await request(app.getHttpServer())
        .delete('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .expect(HttpStatus.FORBIDDEN);

      const invite = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.INVITE_USER}-d`],
      });

      const user = await createUser(app, {
        token: invite.id,
        email: invite.email,
      });

      const session = await createSession(app, user.email, '12345678');

      await request(app.getHttpServer())
        .delete('/authorization-test')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .expect(HttpStatus.OK);

      return await request(app.getHttpServer())
        .delete('/authorization-test')
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.OK);
    });

    it('should be able to access only if is company member', async () => {
      const inviteContractOK = await createToken(app, sessionAdmin.token, {
        companyId: companyContract.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userContractOK = await createUser(app, {
        token: inviteContractOK.id,
        email: inviteContractOK.email,
      });

      const sessionContractOK = await createSession(
        app,
        userContractOK.email,
        '12345678',
      );

      const inviteMainOK = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userMainOK = await createUser(app, {
        token: inviteMainOK.id,
        email: inviteMainOK.email,
      });

      const sessionMainOK = await createSession(
        app,
        userMainOK.email,
        '12345678',
      );

      const companyMain2 = await createCompany(app, sessionAdmin.token);

      const inviteMain2 = await createToken(app, sessionAdmin.token, {
        companyId: companyMain2.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userMain2 = await createUser(app, {
        token: inviteMain2.id,
        email: inviteMain2.email,
      });

      const sessionMain2 = await createSession(
        app,
        userMain2.email,
        '12345678',
      );

      await request(app.getHttpServer())
        .get('/authorization-test/6')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get('/authorization-test/6')
        .set('Authorization', `Bearer ${sessionContractOK.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get('/authorization-test/6')
        .set('Authorization', `Bearer ${sessionContract.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get('/authorization-test/6')
        .set('Authorization', `Bearer ${sessionMain2.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      return await request(app.getHttpServer())
        .get('/authorization-test/6')
        .set('Authorization', `Bearer ${sessionMainOK.token}`)
        .send({ companyId: companyContract.id, myCompanyId: companyMain.id })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should be able to access only if is contract', async () => {
      const inviteContractOK = await createToken(app, sessionAdmin.token, {
        companyId: companyContract.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userContractOK = await createUser(app, {
        token: inviteContractOK.id,
        email: inviteContractOK.email,
      });

      const sessionContractOK = await createSession(
        app,
        userContractOK.email,
        '12345678',
      );

      const inviteMainOK = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userMainOK = await createUser(app, {
        token: inviteMainOK.id,
        email: inviteMainOK.email,
      });

      const sessionMainOK = await createSession(
        app,
        userMainOK.email,
        '12345678',
      );

      const companyMain2 = await createCompany(app, sessionAdmin.token);

      const inviteMain2 = await createToken(app, sessionAdmin.token, {
        companyId: companyMain2.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userMain2 = await createUser(app, {
        token: inviteMain2.id,
        email: inviteMain2.email,
      });

      const sessionMain2 = await createSession(
        app,
        userMain2.email,
        '12345678',
      );

      await request(app.getHttpServer())
        .get('/authorization-test/7')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get('/authorization-test/7')
        .set('Authorization', `Bearer ${sessionContractOK.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      await request(app.getHttpServer())
        .get('/authorization-test/7')
        .set('Authorization', `Bearer ${sessionContract.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      await request(app.getHttpServer())
        .get('/authorization-test/7')
        .set('Authorization', `Bearer ${sessionMain2.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      await request(app.getHttpServer())
        .get('/authorization-test/7')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .send({ companyId: companyContract.id, myCompanyId: companyMain.id })
        .expect(HttpStatus.OK);

      return await request(app.getHttpServer())
        .get('/authorization-test/7')
        .set('Authorization', `Bearer ${sessionMainOK.token}`)
        .send({ companyId: companyContract.id, myCompanyId: companyMain.id })
        .expect(HttpStatus.OK);
    });

    it('should be able to access only for contract and code', async () => {
      const inviteContractOK = await createToken(app, sessionAdmin.token, {
        companyId: companyContract.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userContractOK = await createUser(app, {
        token: inviteContractOK.id,
        email: inviteContractOK.email,
      });

      const sessionContractOK = await createSession(
        app,
        userContractOK.email,
        '12345678',
      );

      const inviteMainOK = await createToken(app, sessionAdmin.token, {
        companyId: companyMain.id,
        permissions: [],
      });

      const userMainOK = await createUser(app, {
        token: inviteMainOK.id,
        email: inviteMainOK.email,
      });

      const sessionMainOK = await createSession(
        app,
        userMainOK.email,
        '12345678',
      );

      const companyMain2 = await createCompany(app, sessionAdmin.token);

      const inviteMain2 = await createToken(app, sessionAdmin.token, {
        companyId: companyMain2.id,
        permissions: [`${Permission.CREATE_COMPANY}-crud`],
      });

      const userMain2 = await createUser(app, {
        token: inviteMain2.id,
        email: inviteMain2.email,
      });

      const sessionMain2 = await createSession(
        app,
        userMain2.email,
        '12345678',
      );

      await request(app.getHttpServer())
        .get('/authorization-test/8')
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get('/authorization-test/8')
        .set('Authorization', `Bearer ${sessionContractOK.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      await request(app.getHttpServer())
        .get('/authorization-test/8')
        .set('Authorization', `Bearer ${sessionContract.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      await request(app.getHttpServer())
        .get('/authorization-test/8')
        .set('Authorization', `Bearer ${sessionMain2.token}`)
        .send({ companyId: companyContract.id })
        .expect(HttpStatus.FORBIDDEN);

      await request(app.getHttpServer())
        .get('/authorization-test/8')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .send({ companyId: companyContract.id, myCompanyId: companyMain.id })
        .expect(HttpStatus.OK);

      return await request(app.getHttpServer())
        .get('/authorization-test/8')
        .set('Authorization', `Bearer ${sessionMainOK.token}`)
        .send({ companyId: companyContract.id, myCompanyId: companyMain.id })
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
