import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPhoneUnique implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(phone: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const userId = validationArguments?.object['id'];
    const user = await this.usersService.isPhoneUnique(phone, userId);
    return !user;
  }

  defaultMessage(): string {
    return 'Số điện thoại đã tồn tại. Vui lòng nhập số điện thoại khác.';
  }
}
