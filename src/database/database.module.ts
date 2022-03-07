import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { mongoUri } from './mongo.memory';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const mongoURI = await mongoUri();
        return {
          uri:
            configService.get<string>('NODE_ENV') === 'test'
              ? mongoURI
              : configService.get<string>('DB_PATH'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
