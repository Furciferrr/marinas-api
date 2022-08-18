import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../decorators/validate.decorator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'username field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  readonly username: string;
  @IsNotEmpty({ message: 'password field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  readonly password: string;
}
