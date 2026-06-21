import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const isAuthenticated = await this.checkAuthentication(req);
    if (isAuthenticated) {
      // Nếu xác thực thành công, thực hiện hành động mong muốn
      console.log('Authentication successful!');

      next();
    } else {
      // Nếu xác thực không thành công, gửi ra lỗi UnauthorizedException
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private async checkAuthentication(req: Request): Promise<any> {
    // Thực hiện kiểm tra xác thực thực tế ở đây
    const header = req.headers;
    const authorization = header.authorization;
    const authorizationId = header['authorization-id'];
    try {
      const res = await this.httpService
        .post(
          this.configService.get('AUTHEN_API') + '/authen/authenticate',
          {},
          {
            headers: {
              authorization,
              'authorization-id': authorizationId,
            },
          },
        )
        .toPromise();
      return !!res;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
