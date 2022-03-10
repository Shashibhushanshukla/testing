import { Test, TestingModule } from '@nestjs/testing';

import { UsercontactController } from '../usercontact.controller';
import { UsercontactService } from '../usercontact.service';
import {
  createUser,
  returnUser,
  updateReturnUser,
} from '../stub/stub.controller';
import { CACHE_MANAGER } from '@nestjs/common';

const req = {
  query: {},
};
const data = {
  json: jest.fn().mockResolvedValue([returnUser()]),
};
const data2 = {
  json: jest.fn().mockResolvedValue([createUser()]),
};
const data1 = {
  json: jest.fn().mockResolvedValue([updateReturnUser()]),
};
const res = {
  status: jest.fn(() => data),
  json: jest.fn().mockResolvedValue([returnUser()]),
};
const updateResponse = {
  status: jest.fn(() => data1),
  json: jest.fn().mockResolvedValue([updateReturnUser()]),
};
const createResponse = {
  status: jest.fn(() => data2),
  json: jest.fn().mockResolvedValue([createUser()]),
};

describe('UsercontactController', () => {
  let controller: UsercontactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsercontactController],
      providers: [
        {
          provide: UsercontactService,
          useValue: {
            getUsers: jest.fn().mockResolvedValue([returnUser()]),
            findOne: jest.fn().mockResolvedValue([returnUser()]),
            update: jest.fn().mockResolvedValue([updateReturnUser()]),
            delete: jest.fn().mockResolvedValue([returnUser()]),
            create: jest.fn().mockResolvedValue([createUser()]),
            count: jest.fn().mockImplementation(() => [returnUser()].length),
          },
        },
        {
          provide: 'winston',
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsercontactController>(UsercontactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAll method', async () => {
    const page = 1;
    const limit = 10;
    const recieved = await controller.getUsers(page, limit, res, req);
    expect(recieved).toEqual([returnUser()]);
  });

  it('getone method', async () => {
    const recieved = await controller.userDetail(returnUser()._id, res, req);
    expect(recieved).toEqual([returnUser()]);
  });

  it('update method', async () => {
    const recieved = await controller.updateUserDetail(
      returnUser()._id,
      updateReturnUser(),
      updateResponse,
      req,
    );
    expect(recieved).toEqual([updateReturnUser()]);
  });

  it('deleted method', async () => {
    const recieved = await controller.deleteUserDetail(
      returnUser()._id,
      res,
      req,
    );
    expect(recieved).toEqual([returnUser()]);
  });

  it('create method', async () => {
    const recieved = await controller.create(createResponse, req, {
      name: 'Ashar',
      email: 'Ashar@gmail.com',
      phone: '12345',
      address: 'abc',
      userEmail: 'test1',
      status: '1',
    });
    expect(recieved).toEqual([createUser()]);
  });
});
