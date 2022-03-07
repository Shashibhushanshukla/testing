import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model, now } from 'mongoose';
import { User, UserDocument } from '../../common/schemas/user.schema';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async validateOAuthLogin(
    thirdPartyId: string,
    provider: Provider,
    userDetail: any,
  ): Promise<string> {
    try {
      const payload = {
        thirdPartyId,
        provider,
      };

      const jwt: string = sign(payload, this.JWT_SECRET_KEY, {
        expiresIn: 3600,
      });

      const userDataGoogle = {
        name: userDetail.firstName + ' ' + userDetail.lastName,
        email: userDetail.email,
        token: jwt,
        createdAt: now(),
        updatedAt: now(),
      };

      this.createGoogleUser(userDataGoogle);

      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async createGoogleUser(Payload: any): Promise<User> {
    const payloadObject = Payload;
    // Check if exist then update else insert
    const checkUser = await this.userModel
      .findOne({ email: payloadObject.email })
      .exec();
    if (checkUser) {
      // Update token
      const filter = { email: payloadObject.email };
      const update = { token: payloadObject.token };
      return await this.userModel.findOneAndUpdate(filter, update, {
        new: true,
      });
    } else {
      // Insert //
      const createdGoogleUser = new this.userModel(payloadObject);
      return await createdGoogleUser.save();
    }
  }

  /*
      async addToCache(key: string, item: string) {
        await this.cacheManager.set(key, item);
      }
    
      async getFromCache(key: string) {
        const value = await this.cacheManager.get(key);
        return value;
      }
*/
} // End Class
