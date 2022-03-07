import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   *
   * @returns String
   */
  getHello(): string {
    return 'Hello World!';
  }
}
