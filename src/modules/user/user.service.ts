import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id: id }).then((user) => {
      if (!user) {
        this.logger.error('User not found', { id });
        throw new NotFoundException('User not found');
      }
      return user;
    });
  }

  create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  updatePassword(id: string, newPassword: string): Promise<User> {
    return this.userRepository.findOneBy({ id: id }).then((user) => {
      user.password = newPassword;
      this.userRepository.save(user);
      return user;
    });
  }

  remove(id: string) {
    return this.userRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new Error('User not found');
      }
    });
  }
}
