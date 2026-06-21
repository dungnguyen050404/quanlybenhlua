import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { GraphqlService } from 'graphql/graphql.service';
import { getUsersWhereWithPassword } from 'graphql/query';
import { Request } from 'express';
import { STATUS_ACTIVE } from 'utils/enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private graphqlService: GraphqlService,
  ) {
    super({
      // Cấu hình cách trích xuất token từ request (cookie trước, header sau)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token, // Cách 1: Lấy token từ cookie (HttpOnly cookie)
        // ExtractJwt.fromAuthHeaderAsBearerToken(), // Cách 2: Lấy token từ header Authorization nếu không có trong cookie
      ]),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  // B7. Hàm này được gọi sau khi token được xác thực thành công (giải mã payload)
  async validate(payload: any) {
    const variables = {
      deleted_at: { _is_null: true },
      id: { _eq: payload.sub },
      status: { _eq: STATUS_ACTIVE.ACTIVE },
    };

    const result: any = await this.graphqlService.query(getUsersWhereWithPassword, {
      where: variables,
    });
    return result.users[0];
  }
}
