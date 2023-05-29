// LIBS
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('')
  helloServer() {
    return 'Server is running healthy !';
  }
}
