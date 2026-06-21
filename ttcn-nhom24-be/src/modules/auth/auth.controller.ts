import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetToken, GetUser, Public } from 'common/decorators';
import { LoginAuthDto } from './dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
    const { access_token, expires_in } = await this.authService.login(loginAuthDto);

    // Set HTTP-only cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      domain: this.configService.get<string>('COOKIE_DOMAIN') || 'localhost',
      maxAge: expires_in,
    });
  }

  @ApiBearerAuth()
  @Get('me')
  findOne(@GetUser() user: any) {
    return user;
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(@GetToken() token: string, @Res({ passthrough: true }) res: Response) {
    if (token) {
      await this.authService.logout(token);
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'lax',
        domain: this.configService.get<string>('COOKIE_DOMAIN') || 'localhost',
      });
    }
  }
}
