import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';
import { Connection } from 'mongoose';

import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { UsercontactModule } from '../src/modules/user-contact/usercontact.module';
import {
  newUser,
  updateReturnUser,
} from '../src/modules/user-contact/stub/stub.service';
import { JwtAuthGuard } from '../src/common/guard/jwt-auth-gaurd';
import { UserContactDto } from '../src/modules/user-contact/dto/v1/user-contact.dto';
import { createUser } from '../src/modules/user-contact/stub/stub.controller';
import { UpdateUserContactDto } from '../src/modules/user-contact/dto/v1/update-user-contact.dto';

describe('UsercontactController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let id: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsercontactModule],
      providers: [
        {
          provide: JwtAuthGuard,
          useValue: new (AuthGuard('jwt'))(),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await dbConnection.collection('usercontacts').deleteMany({});
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('testing').deleteMany({});
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('test suit for userontact module', () => {
    it('returns users array', async () => {
      await dbConnection.collection('usercontacts').insertOne(newUser);
      const response = await request(httpServer).get('/admin/get-users');
      id = response.body.data[0]._id;
      expect(response.status).toBe(200);
    });

    it('returns user', async () => {
      const response = await request(httpServer).get(
        `/admin/user-detail/${id}`,
      );
      expect(response.status).toBe(200);
    });

    it('creates User from admin', async () => {
      const createUserRequest: UserContactDto = {
        name: createUser().name,
        email: createUser().email,
        phone: createUser().phone,
        address: createUser().address,
        userEmail: createUser().userEmail,
        status: createUser().status,
      };
      const response = await request(httpServer)
        .post('/admin/create-user')
        .send(createUserRequest);
      expect(response.status).toBe(200);
    });

    it('updates User', async () => {
      const updateUserRequest: UpdateUserContactDto = {
        phone: updateReturnUser().phone,
        address: updateReturnUser().address,
        status: updateReturnUser().status,
      };
      const response = await request(httpServer)
        .put(`/admin/update-user-detail/${id}`)
        .send(updateUserRequest);
      expect(response.status).toBe(200);
    });

    it('deletes User', async () => {
      const response = await request(httpServer)
        .delete(`/admin/delete-user-detail/${id}`)
        .send();
      expect(response.status).toBe(200);
    });
  });
});
