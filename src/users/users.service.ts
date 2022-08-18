import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorBuilder } from '../common/error-factory';
import { ErrorType } from '../types/error.type';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly errorBuilder: ErrorBuilder,
  ) {}

  async create(
    user: CreateUserDto,
  ): Promise<{ resultCode: 0; result: UserEntity } | ErrorType> {
    const isEmailExist = await this.userRepository.findOneBy({
      email: user.email,
    });
    const isUserNameExist = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (isEmailExist || isUserNameExist) {
      return this.errorBuilder.create(
        [
          {
            message: isEmailExist
              ? 'Email already exist'
              : 'Username already exist',
            field: isEmailExist ? 'email' : 'username',
          },
        ],
        1,
      );
    }
    const hashPassword = await this.#generateHash(user.password);
    const newUser = await this.userRepository.insert({
      username: user.username,
      email: user.email,
      hashPassword,
    });
    return { result: newUser.raw, resultCode: 0 };
  }

  async findOne(username: string): Promise<any | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async #generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async deleteUserById(id: string): Promise<any> {
    const result = await this.userRepository.delete(id);
    return result.affected === 1;
  }
}
