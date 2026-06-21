import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchLogDiseaseDto {
  @ApiProperty({
    description: 'Từ khóa, không được để trống',
    example: 'Bệnh đạo ôn',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập từ khóa.' })
  @IsNotEmpty({ message: 'Vui lòng nhập từ khóa.' })
  @IsString({ message: 'Vui lòng nhập từ khóa chuỗi hợp lệ.' })
  keyword: string;

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

export class StatisticsDto {
  @ApiProperty({
    description: 'Ngày bắt đầu, được để trống',
    example: '2025-11-01',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Vui lòng nhập ngày sinh hợp lệ.' })
  @Type(() => Date)
  start_date?: Date;

  @ApiProperty({
    description: 'Ngày kết thúc, được để trống',
    example: '2025-11-12',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Vui lòng nhập ngày sinh hợp lệ.' })
  @Type(() => Date)
  end_date?: Date;
}
