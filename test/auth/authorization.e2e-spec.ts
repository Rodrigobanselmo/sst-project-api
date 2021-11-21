import { UserEntity } from '../../src/modules/users/entities/user.entity';
import { CompanyEntity } from '../../src/modules/company/entities/company.entity';
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
import { FakeInvite } from '../utils/fake/invite.fake';
import { FakerUser } from '../utils/fake/user.fake';
import { User } from '.prisma/client';
import { FakeCompany } from '../utils/fake/company.fake';
import { FakeWorkspace } from '../utils/fake/workspace.fake';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { InviteUserDto } from '../../src/modules/users/dto/invite-user.dto';
import { Permission } from '../../src/shared/constants/authorization';
import { UpdateUserCompanyDto } from 'src/modules/users/dto/update-user-company.dto';

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

    it('should be able access only with permission', async () => {
      return await request(app.getHttpServer())
        .get('/authorization-test')
        .set('Authorization', `Bearer ${sessionMain.token}`)
        .expect(HttpStatus.OK);
    });

    it('should be able access crud on get', async () => {
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

    it('should be able access crud on post', async () => {
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

    it('should be able access only for same company', async () => {
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

    it('should be able access only for same company and crud', async () => {
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

    it('should be able access crud on patch', async () => {
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

    it('should be able access only for company or childCompanies', async () => {
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

    it('should be able access only for childCompanies and crud', async () => {
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

    it('should be able access crud on delete', async () => {
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

    it.todo('should be able access only for childCompanies');
    // it('should return user', async () => {});
  });

  // describe('Get ME [GET /me]', () => {
  //   it('should return user', async () => {
  //     const sessionUser: LoginUserDto = {
  //       email: user.email,
  //       password: user.password,
  //     };

  //     const { body: session } = await request(app.getHttpServer())
  //       .post('/session')
  //       .send(sessionUser);

  //     // trying to access route without token
  //     await request(app.getHttpServer())
  //       .get('/users/me')
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     const userMe = await request(app.getHttpServer())
  //       .get('/users/me')
  //       .set('Authorization', `Bearer ${session.token}`)
  //       .expect(HttpStatus.OK);

  //     expect(userMe.body).not.toHaveProperty('password');

  //     return expect(userMe.body.companies).toEqual([]);
  //   });
  // });

  // describe('Create [POST]', () => {
  //   it('should create User', async () => {
  //     const createUser = new FakerUser();
  //     delete createUser.token;

  //     const user = await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.CREATED);

  //     expect(user.body).not.toHaveProperty('password');

  //     return expect(user.body.companies).toEqual([]);
  //   });

  //   it('should not create User with same email', async () => {
  //     const createUser = new FakerUser({ email: user.email });
  //     delete createUser.token;

  //     return await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });

  //   it('should validate fields', async () => {
  //     const createUser = new FakerUser({ email: '123' });
  //     return await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });

  //   it('should validate token', async () => {
  //     const createUser = new FakerUser();
  //     return await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.NOT_FOUND);
  //   });

  //   it('should create token and add permissions on create user', async () => {
  //     const createInvite = new FakeInvite();

  //     await request(app.getHttpServer()).post('/invites').send(createInvite);

  //     const { body: invite } = await request(app.getHttpServer())
  //       .post('/invites')
  //       .send(createInvite)
  //       .set('Authorization', `Bearer ${sessionAdmin.token}`)
  //       .expect(HttpStatus.CREATED);

  //     const createUser = new FakerUser({
  //       token: invite.id,
  //       email: invite.email,
  //     });

  //     const user = await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.CREATED);

  //     return expect(user.body.companies).not.toEqual([]);
  //   });

  //   it('should not create user if token is assigned to another email or email already exist', async () => {
  //     const createInvite = new FakeInvite();

  //     const { body: invite } = await request(app.getHttpServer())
  //       .post('/invites')
  //       .send(createInvite)
  //       .set('Authorization', `Bearer ${sessionAdmin.token}`)
  //       .expect(HttpStatus.CREATED);

  //     const createUser = new FakerUser({
  //       token: invite.id,
  //     });

  //     await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.BAD_REQUEST);

  //     const createUserInvite = new FakerUser({
  //       email: invite.email,
  //       token: invite.id,
  //     });

  //     await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUserInvite)
  //       .expect(HttpStatus.CREATED);

  //     // user already exist in this company
  //     return await request(app.getHttpServer())
  //       .post('/invites')
  //       .send(createInvite)
  //       .set('Authorization', `Bearer ${sessionAdmin.token}`)
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });
  // });

  // describe('Update one [PATCH]', () => {
  //   it('Update user', async () => {
  //     const createUser = new FakerUser();

  //     delete createUser.token;

  //     const sessionUser = {
  //       email: createUser.email,
  //       password: createUser.password,
  //     };

  //     await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.CREATED);

  //     const { body: session } = await request(app.getHttpServer())
  //       .post('/session')
  //       .send(sessionUser)
  //       .expect(HttpStatus.OK);

  //     return request(app.getHttpServer())
  //       .patch(`/users/update`)
  //       .set('Authorization', `Bearer ${session.token}`)
  //       .send({ email: 'user@gmail.com' })
  //       .expect(HttpStatus.OK)
  //       .then(({ body }) => {
  //         expect(body).toEqual(
  //           expect.objectContaining({
  //             id: expect.any(Number),
  //             email: expect.any(String),
  //           }),
  //         );
  //         expect(body.password).toBeUndefined();
  //       });
  //   });

  //   it('Update user password or fail if incorrect', async () => {
  //     const createUser = new FakerUser();

  //     delete createUser.token;

  //     const sessionUser = {
  //       email: createUser.email,
  //       password: createUser.password,
  //     };

  //     await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.CREATED);

  //     const { body: session } = await request(app.getHttpServer())
  //       .post('/session')
  //       .send(sessionUser)
  //       .expect(HttpStatus.OK);

  //     await request(app.getHttpServer())
  //       .patch(`/users/update`)
  //       .set('Authorization', `Bearer ${session.token}`)
  //       .send({
  //         password: '1234567890',
  //         oldPassword: 'incorrect',
  //       })
  //       .expect(HttpStatus.BAD_REQUEST);

  //     return request(app.getHttpServer())
  //       .patch(`/users/update`)
  //       .set('Authorization', `Bearer ${session.token}`)
  //       .send({
  //         password: '1234567890',
  //         oldPassword: createUser.password,
  //       })
  //       .expect(HttpStatus.OK)
  //       .then(({ body }) => {
  //         expect(body).toEqual(
  //           expect.objectContaining({
  //             id: expect.any(Number),
  //             email: expect.any(String),
  //           }),
  //         );
  //         expect(body.password).toBeUndefined();
  //       });
  //   });

  //   it('Update user roles and permissions by token', async () => {
  //     const createUser = new FakerUser();

  //     delete createUser.token;

  //     const sessionUser = {
  //       email: createUser.email,
  //       password: createUser.password,
  //     };

  //     await request(app.getHttpServer())
  //       .post('/users')
  //       .send(createUser)
  //       .expect(HttpStatus.CREATED);

  //     const { body: session } = await request(app.getHttpServer())
  //       .post('/session')
  //       .send(sessionUser)
  //       .expect(HttpStatus.OK);

  //     const createInvite = new FakeInvite({ email: createUser.email });

  //     const { body: invite } = await request(app.getHttpServer())
  //       .post('/invites')
  //       .send(createInvite)
  //       .set('Authorization', `Bearer ${sessionAdmin.token}`)
  //       .expect(HttpStatus.CREATED);

  //     return request(app.getHttpServer())
  //       .patch(`/users/update`)
  //       .set('Authorization', `Bearer ${session.token}`)
  //       .send({ token: invite.id })
  //       .expect(HttpStatus.OK)
  //       .then(({ body }) => {
  //         expect(body.companies[0].permissions).toEqual(
  //           createInvite.permissions,
  //         );
  //         expect(body.companies[0].roles).toEqual(createInvite.roles);
  //       });
  //   });
  // });

  //   return request(app.getHttpServer())
  //     .get('/users')
  //     .set('Authorization', `Bearer ${refreshSession.token}`)
  //     .expect(HttpStatus.OK)
  //     .then(({ body }) => {
  //       expect(Array.isArray(body)).toBe(true);
  //       expect(body).toEqual(
  //         expect.arrayContaining([
  //           expect.objectContaining({
  //             id: expect.any(Number),
  //             email: expect.any(String),
  //             name: expect.any(String),
  //             created_at: expect.any(String),
  //             roles: expect.arrayContaining([expect.any(String)]),
  //             permissions: expect.arrayContaining([expect.any(String)]),
  //           }),
  //         ]),
  //       );
  //       expect(body).toEqual(
  //         expect.arrayContaining([
  //           expect.not.objectContaining({
  //             password: expect.any(String),
  //           }),
  //         ]),
  //       );
  //     });
  // });

  // it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
