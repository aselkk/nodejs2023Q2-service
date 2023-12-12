import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LoginDto } from './dtos/login.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { SignupDto } from './dtos/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    readonly authService: AuthService,
  ) {}

  private refreshTokens = [];

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = new User();

    user.login = signupDto.login;
    user.salt = this.authService.createSalt();
    user.password = this.authService.hashPassword(
      signupDto.password,
      user.salt,
    );

    this.userRepository.save(user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ login: loginDto.login });

    // check password
    if (
      user.password !==
      this.authService.hashPassword(loginDto.password, user.salt)
    ) {
      throw new UnauthorizedException('Credentails is invalid');
    }

    const token = this.authService.createToken(user.salt, {
      login: user.login,
      userId: user.id,
    });
    const refreshToken = this.authService.createRefreshToken();

    this.refreshTokens.push(refreshToken);

    return { token, refreshToken };
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    if (!this.refreshTokens.includes(refreshDto.refreshToken)) {
      throw new UnauthorizedException('Invalid token');
    }

    this.refreshTokens = this.refreshTokens.filter(
      (refreshToken) => refreshToken !== refreshDto.refreshToken,
    );

    const payload = this.authService.verifyToken(refreshDto.refreshToken);

    const user = await this.userRepository.findOneBy({ id: payload.userId });
    user.salt = this.authService.createSalt();
    this.userRepository.save(user);

    const token = this.authService.createToken(user.salt, {
      login: user.login,
      userId: user.id,
    });
    const refreshToken = this.authService.createRefreshToken();

    this.refreshTokens.push(refreshToken);

    return { token, refreshToken };
  }
}
