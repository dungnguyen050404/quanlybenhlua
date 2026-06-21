import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { NewsService } from '../news.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CheckTitleNew implements ValidatorConstraintInterface {
  constructor(private readonly newService: NewsService) {}

  async validate(title: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const id = validationArguments?.object['id'];
    const result = await this.newService.isTitleNewUnique(title, id);
    return !result;
  }

  defaultMessage(): string {
    return 'Tiêu đề đã tồn tại. Vui lòng nhập lại.';
  }
}
