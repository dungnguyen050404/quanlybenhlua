import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class ViewDiseaseDto {
  @ApiProperty({
    description: 'ID bệnh, không được để trống',
    example: '1',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập ID bệnh.' })
  @IsNumber({}, { message: 'Vui lòng nhập ID bệnh hợp lệ.' })
  @IsNotEmpty({ message: 'Vui lòng nhập ID bệnh.' })
  disease_id: number;
}
