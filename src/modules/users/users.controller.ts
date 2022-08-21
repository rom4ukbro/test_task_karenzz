import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/testUsers')
  async addTestUsers() {
    return await this.usersService.createTestUsers();
  }
}
