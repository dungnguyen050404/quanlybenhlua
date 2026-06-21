import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.isEmailUnique(loginAuthDto.email);
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');

    const checkStatus = await this.userService.checkStatus(user.id);
    if (!checkStatus) throw new UnauthorizedException('Tài khoản của bạn đã bị khóa.');

    const isValid = await argon.verify(user.password, loginAuthDto.password);
    if (!isValid) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');

    return this.generateTokenResponse(user);
  }

  async generateTokenResponse(user: any) {
    const expires_in = this.configService.get<number>('JWT_EXPIRES_IN');
    const access_token = await this.convertToJwtToken(user, expires_in);

    return { access_token, expires_in, auth_type: 'Bearer Token' };
  }

  async convertToJwtToken(user: any, expiresIn: number): Promise<string> {
    const payload = { sub: user.id, email: user.email, type: user.type };
    return await this.jwtService.signAsync(payload, {
      expiresIn,
      secret: this.configService.get('JWT_SECRET_KEY'),
    });
  }

  // Đăng xuất
  async logout(token: string) {
    const expirationTime = this.getTokenExpiration(token);
    const currentTokens = (await this.cacheManager.get<string[]>('organizer-token-block-list')) || [];
    currentTokens.push(token);

    // Lưu token vào cache với thời gian hết hạn
    await this.cacheManager.set('organizer-token-block-list', currentTokens, expirationTime);
  }

  // Tính ra thời gian còn lại của token
  private getTokenExpiration(token: string): number {
    const decodedToken = this.jwtService.decode(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return decodedToken.exp - currentTimestamp;
  }

  // Kiểm tra xem token có bị block-list không
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.cacheManager.get<string[]>('organizer-token-block-list');
    // Kiểm tra xem token có nằm trong mảng không
    return result ? result.includes(token) : false;
  }
}
