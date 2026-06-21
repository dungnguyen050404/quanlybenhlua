import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class MatchPassword implements ValidatorConstraintInterface {
  validate(confirm_password: string, args: ValidationArguments) {
    const object = args.object as any;
    return confirm_password === object.new_password;
  }

  defaultMessage(): string {
    return 'Mật khẩu xác nhận không khớp.';
  }
}
