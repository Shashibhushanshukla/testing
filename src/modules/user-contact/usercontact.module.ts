import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserContact, UserContactSchema } from './schemas/user-contact.schema';
import { UsercontactController } from './usercontact.controller';
import { UsercontactService } from './usercontact.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserContact.name, schema: UserContactSchema },
    ]),
  ],
  controllers: [UsercontactController],
  providers: [UsercontactService],
})
export class UsercontactModule {}
