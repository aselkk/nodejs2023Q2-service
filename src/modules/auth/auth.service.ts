import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface TokenPayload {
  login: string;
  userId: string;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createSalt(): string {
    return bcrypt.genSaltSync();
  }

  hashPassword(password: string, salt: string): string {
    return bcrypt.hashSync(password, salt);
  }

  createToken(salt: string, payload: Omit<TokenPayload, 'exp'>): string {
    const expiration = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes expiration

    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64');
    const _payload = Buffer.from(
      JSON.stringify({ exp: expiration, ...payload }),
    ).toString('base64');

    const signature = bcrypt.hashSync(`${header}.${payload}`, salt);

    return `${header}.${_payload}.${signature}`;
  }

  createRefreshToken(): string {
    const expiration = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days expiration

    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64');
    const payload = Buffer.from(JSON.stringify({ exp: expiration })).toString(
      'base64',
    );

    const signature = bcrypt.hashSync(`${header}.${payload}`, 10);

    const token = `${header}.${payload}.${signature}`;

    return token;
  }

  verifyToken(token: string): TokenPayload {
    const [header, payload, signature] = token.split('.');

    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64').toString(),
    );

    // // Verify signature
    // const user = await this.userRepository.findOneBy({
    //   id: decodedPayload.userId,
    // });

    // if (signature !== bcrypt.hashSync(`${header}.${payload}`, user.salt)) {
    //   return null;
    // }

    // Check token expiration
    if (
      decodedPayload.exp &&
      decodedPayload.exp < Math.floor(Date.now() / 1000)
    ) {
      throw new UnauthorizedException('Token expired');
    }

    return decodedPayload;
  }
}
