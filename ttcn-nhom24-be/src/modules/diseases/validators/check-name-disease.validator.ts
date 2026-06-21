import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DiseasesService } from '../diseases.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CheckNameDisease implements ValidatorConstraintInterface {
  constructor(private readonly diseasesService: DiseasesService) {}

  async validate(name: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const id = validationArguments?.object['id'];
    const result = await this.diseasesService.isNameDiseaseUnique(name, id);
    return !result;
  }

  defaultMessage(): string {
    return 'Tên bệnh đã tồn tại. Vui lòng nhập lại.';
  }
}
