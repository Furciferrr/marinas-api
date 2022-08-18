import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { LoginUserDto } from '../users/dto/loginUser.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidateMiddleware implements NestMiddleware {
  //constructor() {}
  async use(req: Request, res: Response, next: NextFunction) {
    const result = plainToClass(LoginUserDto, req.body);

    const errors = await validate(result, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      res.status(400).send({
        message: errors[0].constraints.whitelistValidation,
        field: errors[0].property,
      });
      return;
    }
    next();
  }
}
