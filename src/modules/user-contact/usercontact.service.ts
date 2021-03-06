import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now, Types } from 'mongoose';

import { UserContact } from './schemas/user-contact.schema';
import { UpdateUserContactDto } from './dto/v1/update-user-contact.dto';
import { UserContactDto } from './dto/v1/user-contact.dto';
import { UserContactV2Dto } from './dto/v2/user-contact.dto';

@Injectable()
export class UsercontactService {
  constructor(
    @InjectModel(UserContact.name)
    public userContact: Model<UserContact>,
  ) {}

  /**
   * Method that creates data according to version 1 Dto in Database
   *
   * @param userData schema format to create
   * @returns object(created User)
   */
  async create(userData: UserContactDto): Promise<UserContact> {
    try {
      const userDataNew = await this.userContact.create({
        ...userData,
        id: new Types.ObjectId(),
        createdAt: now(),
        updatedAt: now(),
      } as any);

      if (userDataNew) {
        return userDataNew;
      }
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Method that creates data according to version 2 Dto in Database
   *
   * @param userData schema format to create
   * @returns object(created User)
   */
  async createv2(userData: UserContactV2Dto): Promise<UserContact> {
    try {
      return await new this.userContact({
        ...userData,
        createdAt: now(),
        updatedAt: now(),
      }).save();
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async count(): Promise<number> {
    return await this.userContact.count();
  }

  /**
   * Method that get all users data from Database
   *
   * @returns array of objects
   */
  async getUsers(page?: number, limit?: number): Promise<UserContact[]> {
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const data = await this.userContact
      .find({ deletedAt: undefined })
      .limit(limit)
      .skip(skip);
    return data;
  }

  /**
   * Method that get single user data from Database
   *
   * @param id Particular identification of User via id
   * @returns object of UserContact type
   */
  async findOne(id: string): Promise<UserContact> {
    try {
      const finalQuery = { deletedAt: undefined, id };
      const data = await this.userContact.findOne(finalQuery);
      return data;
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Method that update single user data in Database
   *
   * @param id Particular identification of User via id
   * @returns object (updated user)
   */
  async update(
    id: string,
    updateUserContactDto: UpdateUserContactDto,
  ): Promise<UserContact> {
    try {
      const filter = { id: id };
      const update = { ...updateUserContactDto };
      await this.userContact.findOneAndUpdate(filter, update);
      return await this.userContact.findById(id);
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Method that delete single user data from Database
   *
   * @param id Particular identification of User via id
   * @returns object
   */
  async delete(id: string): Promise<UserContact> {
    try {
      const user = await this.userContact.findByIdAndDelete(id);
      return user;
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
} // End class
