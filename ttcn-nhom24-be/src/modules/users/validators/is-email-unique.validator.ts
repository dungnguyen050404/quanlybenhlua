import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersService } from 'modules/users/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUnique implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const userId = validationArguments?.object['id'];
    const user = await this.usersService.isEmailUnique(email, userId);
    return !user;
  }

  defaultMessage(): string {
    return 'Email đã tồn tại. Vui lòng nhập địa chỉ email khác.';
  }
}
