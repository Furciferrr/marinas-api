import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}


  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('/registration')
  @UseGuards(ThrottlerGuard)
  async registrationUser(@Body() body: CreateUserDto) {
    const result = await this.userService.create(body);
    if (result.resultCode === 0) {
      return;
    } else {
      throw new HttpException(result.errorsMessages, HttpStatus.CONFLICT);
    }
  }
}
