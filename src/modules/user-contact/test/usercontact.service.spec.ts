import { Test, TestingModule } from '@nestjs/testing';
import { UsercontactService } from '../usercontact.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserContact } from '../schemas/user-contact.schema';
import { newUser, returnUser, updateReturnUser } from '../stub/stub.service';

describe('UsercontactService', () => {
  let service: UsercontactService;

  const userModel = {
    create: jest.fn().mockResolvedValue(newUser),
    getUsers: jest.fn().mockResolvedValue([returnUser]),
    find: jest.fn().mockResolvedValue([returnUser()]),
    exec: jest.fn(),
    findById: jest.fn().mockResolvedValue([returnUser()]),
    findOne: jest.fn().mockResolvedValue([returnUser()]),
    findByIdAndUpdate: jest.fn().mockResolvedValue([updateReturnUser()]),
    update: jest.fn().mockResolvedValue([updateReturnUser()]),
    findByIdAndDelete: jest.fn().mockResolvedValue([returnUser()]),
    delete: jest.fn().mockResolvedValue([returnUser()]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsercontactService,
        {
          provide: getModelToken(UserContact.name),
          useValue: userModel,
        },
        UsercontactService,
        {
          provide: 'userContact',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsercontactService>(UsercontactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create method test', async () => {
    const given = await service.create(newUser);
    expect(given).toEqual(newUser);
  });

  it('get method test', async () => {
    const given = await service.getUsers();
    expect(given).toEqual([returnUser()]);
  });

  it('getOne method test', async () => {
    const given = await service.findOne(returnUser()._id);
    expect(given).toEqual([returnUser()]);
  });
/*
  it('update method test', async () => {
    const given = await service.update(returnUser()._id, updateReturnUser());
    expect(given).toEqual([updateReturnUser()]);
  });

  it('delete method test', async () => {
    const given = await service.delete(returnUser()._id);
    expect(given).toEqual([returnUser()]);
  });
  */
});
