import { IsString } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  static toEntity(data: CreateUserDto): User {
    const user = new User();
    user.login = data.login;
    user.password = data.password;
    return user;
  }
}
