import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { UpdateUserContactDto } from './dto/v1/update-user-contact.dto';
import { UserContactDto } from './dto/v1/user-contact.dto';
import { UserContactV2Dto } from './dto/v2/user-contact.dto';
import { UsercontactService } from './usercontact.service';
import { Logger } from 'winston';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from '../../common/guard/jwt-auth-gaurd';

@Controller('admin')
export class UsercontactController {
  private redisObject = new Object();

  private start = Date.now();

  constructor(
    private readonly UserContact: UsercontactService,
    @Inject('winston') private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   *  Method that call service to create User with default version 1 having Authgaurds authentication.
   *
   * @param response response from Service
   * @param request Calling action to post
   * @param userData Schema format
   * @returns array of Object
   */
  @Post('create-user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Res() response,
    @Req() request,
    @Body() userData: UserContactDto,
  ) {
    try {
      const data = await this.UserContact.create(userData);
      if (data) {
        const end = Date.now();
        this.logger.info(`User detail with email ${data.email} saved`, {
          Controller: UsercontactController.name,
          Path: request.path,
          ts: (end - this.start) / 1000 + ' seconds to execute',
          IP: request.ip,
          method: request.method,
          status: response.statusCode,
        });
        this.createFriendList(data.userEmail, data);
        return response
          .status(HttpStatus.OK)
          .json({ message: 'User Contact save', data: data });
      } else {
        throw new HttpException(
          `Some thing went wrong!! try after some time`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      const end = Date.now();
      this.logger.error(`${error.message}`, {
        Controller: UsercontactController.name,
        Path: request.path,
        ts: (end - this.start) / 1000 + ' seconds to execute',
        IP: request.ip,
        method: request.method,
        status: response.statusCode,
      });
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *  Method that call service to create User in version 2 with Authgaurds authentication.
   *
   * @param response response from Service
   * @param request Calling action to post
   * @param userDataV2 Schema format (UserContactV2Dto)
   * @returns array of Object
   */
  @Version('2')
  @Post('create-user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createUserV2(
    @Res() response,
    @Req() request,
    @Body() userDataV2: UserContactV2Dto,
  ) {
    try {
      const data = await this.UserContact.createv2(userDataV2);
      if (data) {
        const end = Date.now();
        this.logger.info(`User detail with email ${data.email} saved`, {
          Controller: UsercontactController.name,
          Path: request.path,
          ts: (end - this.start) / 1000 + ' seconds to execute',
          IP: request.ip,
          method: request.method,
          status: response.statusCode,
        });
        return response
          .status(HttpStatus.OK)
          .json({ message: 'User Contact save', data: data });
      } else {
        throw new HttpException(
          `Something went wrong!! try after some time`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      const end = Date.now();
      this.logger.error(`${error.message}`, {
        Controller: UsercontactController.name,
        Path: request.path,
        ts: (end - this.start) / 1000 + ' seconds to execute',
        IP: request.ip,
        method: request.method,
        status: response.statusCode,
      });
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *  Method that call service to get Users with default version 1 having Authgaurds authentication.
   *
   * @param response response from Service
   * @param request Calling action to get (fetching of all)
   * @returns array of Objects
   */
  @Get('get-users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Res() response, @Req() request) {
    try {
      const usersData = await this.UserContact.getUsers();
      if (usersData.length > 0) {
        const end = Date.now();
        this.logger.info(`User detail found`, {
          Controller: UsercontactController.name,
          Path: request.path,
          ts: (end - this.start) / 1000 + ' seconds to execute',
          IP: request.ip,
          method: request.method,
          status: response.statusCode,
        });
        return response
          .status(HttpStatus.OK)
          .json({ message: 'User found', data: usersData });
      } else {
        return response
          .status(HttpStatus.OK)
          .json({ message: 'No user found', data: [] });
      }
    } catch (error) {
      const end = Date.now();
      this.logger.error(`${error} - Error`, {
        Controller: UsercontactController.name,
        Path: request.path,
        ts: (end - this.start) / 1000 + ' seconds to execute',
        IP: request.ip,
        method: request.method,
        status: HttpStatus.BAD_REQUEST,
      });
      throw new HttpException(
        `Callback getUser ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   *  Method that call service to get Single User with default version 1 having Authgaurds authentication.
   *
   * @param id Particular identification of User via id
   * @param response response from Service
   * @param request Calling action to get (fetching single)
   * @returns array of Object
   */
  @Get('user-detail/:id')
  @UseGuards(JwtAuthGuard)
  async userDetail(@Param('id') id: string, @Res() response, @Req() request) {
    try {
      const end = Date.now();
      const userDetail = await this.UserContact.findOne(id);
      if (userDetail) {
        this.logger.info(
          `User detail with email ${userDetail[0].email} found`,
          {
            Controller: UsercontactController.name,
            Path: request.path,
            ts: (end - this.start) / 1000 + ' seconds to execute',
            IP: request.ip,
            method: request.method,
            status: response.statusCode,
          },
        );
        return response
          .status(HttpStatus.OK)
          .json({ message: 'User found', data: userDetail });
      } else {
        throw new HttpException(`No user found`, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      const end = Date.now();
      this.logger.error(`${error}`, {
        Controller: UsercontactController.name,
        Path: request.path,
        ts: (end - this.start) / 1000 + ' seconds to execute',
        IP: request.ip,
        method: request.method,
        status: HttpStatus.BAD_REQUEST,
      });
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *  Method that call service to update Users with default version 1 having Authgaurds authentication
   *
   * @param id Particular identification of User via id
   * @param response response from Service
   * @param request Calling action to put i.e Update (Update single user)
   * @returns array of Object
   */
  @Put('update-user-detail/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateUserDetail(
    @Param('id') id: string,
    @Body() updateUserContactDto: UpdateUserContactDto,
    @Res() response,
    @Req() request,
  ) {
    try {
      const userDetail = await this.UserContact.update(
        id,
        updateUserContactDto,
      );
      const end = Date.now();
      if (userDetail) {
        this.logger.info(
          `User detail with email ${userDetail[0].email} updated`,
          {
            Controller: UsercontactController.name,
            Path: request.path,
            ts: (end - this.start) / 1000 + ' seconds to execute',
            IP: request.ip,
            method: request.method,
            status: response.statusCode,
          },
        );
        return response
          .status(HttpStatus.OK)
          .json({ message: 'User updated', data: userDetail });
      } else {
        throw new HttpException(`No user found`, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      const end = Date.now();
      this.logger.error(`${error} - Error`, {
        Controller: UsercontactController.name,
        Path: request.path,
        ts: (end - this.start) / 1000 + ' seconds to execute',
        IP: request.ip,
        method: request.method,
        status: HttpStatus.BAD_REQUEST,
      });
      throw new HttpException(
        `Callback getUser ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   *  Method that call service to delete Users with default version 1 having Authgaurds authentication.
   *
   * @param id Particular identification of User via id
   * @param response response from Service
   * @param request Calling action to delete (delete single user/data)
   * @returns array of Object
   */
  @Delete('delete-user-detail/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async deleteUserDetail(
    @Param('id') id: string,
    @Res() response,
    @Req() request,
  ) {
    try {
      const userDetail = await this.UserContact.delete(id);
      const end = Date.now();
      if (userDetail) {
        this.logger.info(
          `User detail with email ${userDetail[0].email} found`,
          {
            Controller: UsercontactController.name,
            Path: request.path,
            ts: (end - this.start) / 1000 + ' seconds to execute',
            IP: request.ip,
            method: request.method,
            status: response.statusCode,
          },
        );
        return response
          .status(HttpStatus.OK)
          .json({ message: 'User deleted successfully', data: userDetail });
      } else {
        throw new HttpException(`No user found`, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      const end = Date.now();
      this.logger.error(`${error} - Error`, {
        Controller: UsercontactController.name,
        Path: request.path,
        ts: (end - this.start) / 1000 + ' seconds to execute',
        IP: request.ip,
        method: request.method,
        status: HttpStatus.BAD_REQUEST,
      });
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Catching of User at run time.
   *
   * @param email Particular identification of User via email
   * @param response getting from cache Manager
   * @returns User data
   */
  @Get('friends-email/:email')
  @UseGuards(JwtAuthGuard)
  async friendsEmail(
    @Param('email') email: string,
    @Res() response,
    @Req() request,
  ) {
    const emailList = await this.cacheManager.get(`FRIENDS-${email}`);
    return response
      .status(HttpStatus.OK)
      .json({ message: 'User friends emails are as:', data: emailList });
  }

  async createFriendList(userEmail, friendDetail) {
    const emailList: string = await this.cacheManager.get(
      `FRIENDS-${userEmail}`,
    );
    if (emailList) {
      const presentList = emailList + ',' + friendDetail.email;
      await this.cacheManager.set(`FRIENDS-${userEmail}`, presentList, {
        ttl: 300 * 12,
      });
    } else {
      const friendsEmail = friendDetail.email;
      await this.cacheManager.set(`FRIENDS-${userEmail}`, friendsEmail, {
        ttl: 300 * 12,
      });
    }
  }
} // End class
