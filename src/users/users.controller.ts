import { UsersService } from '../users/users.service';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('/')
  findOne(username: string) {
    return this.userService.findOne(username);
  }

  findAll() {
    return this.userService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(@Param('id') id: string) {
    const isRemoved = await this.userService.deleteUserById(id);
    if (!isRemoved) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (isRemoved) {
      return;
    }
  }
}
