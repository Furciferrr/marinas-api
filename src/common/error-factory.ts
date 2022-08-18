import { Injectable } from '@nestjs/common';
import { ErrorType } from '../types/error.type';

@Injectable()
export class ErrorBuilder {
  public create(
    messages: { message: string; field: string }[],
    statusCode: 0 | 1 | 2,
  ): ErrorType {
    const error = {
      errorsMessages: messages,
      resultCode: statusCode,
    };
    return error;
  }
}
