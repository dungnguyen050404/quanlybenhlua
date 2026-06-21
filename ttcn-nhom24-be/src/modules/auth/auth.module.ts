import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { GraphqlService } from 'graphql/graphql.service';
import { UsersService } from 'modules/users/users.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, GraphqlService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
