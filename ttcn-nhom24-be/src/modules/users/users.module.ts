import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsEmailUnique } from './validators/is-email-unique.validator';
import { IsPhoneUnique } from './validators';
import { MatchPassword } from './validators';

@Module({
  controllers: [UsersController],
  providers: [UsersService, IsEmailUnique, IsPhoneUnique, MatchPassword],
})
export class UsersModule {}
