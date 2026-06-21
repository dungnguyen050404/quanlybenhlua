import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    // const authHeader = request.headers?.authorization;

    // B1. Kiểm tra xem route hiện tại có được đánh dấu là public hay không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // B2. Lấy access_token từ cookie(HttpOnly)
    const token = request.cookies?.access_token;

    // hoặc header Authorization
    // const token = request.cookies?.access_token || authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Bạn không có quyền truy cập. Vui lòng đăng nhập để tiếp tục');
    }

    // B3. Kiểm tra xem token có nằm trong blacklist hay không
    if (await this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException(
        'Phiên đăng nhập của bạn đã kết thúc. Vui lòng đăng nhập lại để tiếp tục.',
      );
    }

    // // B4. Kiểm tra vai trò
    // const decoded: any = jwt.verify(token, this.configService.get('JWT_SECRET_KEY'));
    // const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    // if (!Object.values(AccountType).includes(decoded.type)) {
    //   throw new ForbiddenException('Loại tài khoản không hợp lệ');
    // }

    // if (roles && roles.length > 0 && !roles.includes(decoded.type)) {
    //   throw new ForbiddenException('Bạn không có quyền truy cập');
    // }

    // B5. Token hợp lệ, gọi lại phương thức canActivate gốc của AuthGuard để tiếp tục xác thực bằng Passport
    try {
      return super.canActivate(context); // B6. Gọi vào JwtStrategy.validate
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(
          'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.',
        );
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Yêu cầu xác thực không hợp lệ. Vui lòng đăng nhập lại.');
      } else {
        console.error('Authentication error:', err);
        throw new UnauthorizedException('Lỗi xác thực: ' + err.message);
      }
    }
  }
}
