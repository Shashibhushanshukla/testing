import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now, Types } from 'mongoose';
import { UserContact } from './schemas/user-contact.schema';
import { UpdateUserContactDto } from './dto/update-user-contact.dto';
import { UserContactDto } from './dto/user-contact.dto';
import { UserContactV2Dto } from './dto/v2/user-contact.dto';

@Injectable()
export class UsercontactService {
  constructor(
    @InjectModel(UserContact.name)
    public userContact: Model<UserContact>,
  ) {}

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

  async getUsers(): Promise<UserContact[]> {
    const data = await this.userContact.find({ deletedAt: undefined });
    return data;
  }

  async findOne(id: string): Promise<UserContact[]> {
    try {
      const data = await this.userContact.find({
        deletedAt: undefined,
        id: id,
      });
      return data;
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateUserContactDto: UpdateUserContactDto,
  ): Promise<UserContact[]> {
    try {
      const user = await this.userContact.find({
        id,
        updateUserContactDto,
      });
      return user;
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string): Promise<UserContact[]> {
    try {
      const user = await this.userContact.find({
        id: id,
      });
      this.userContact.deleteOne(user);
      return user;
    } catch (err) {
      throw new HttpException(
        `Callback getUser ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
} // End class
