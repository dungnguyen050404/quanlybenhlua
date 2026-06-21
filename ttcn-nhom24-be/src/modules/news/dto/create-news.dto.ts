import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NEW_TYPE } from 'utils/enum';
import { CheckTitleNew } from '../validators/check-title-new.validator';

export class CreateNewsDto {
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: 'Tiêu đề tin tức, không được để trống',
    example: 'Phòng ngừa bệnh đạo ôn trên lúa',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập tiêu đề.' })
  @IsNotEmpty({ message: 'Vui lòng nhập tiêu đề.' })
  @IsString({ message: 'Vui lòng nhập tiêu đề chuỗi hợp lệ.' })
  @Validate(CheckTitleNew)
  title: string;

  @ApiProperty({
    description: 'Loại tin tức (1: Tin mới, 2: Tin nổi bật)',
    enum: NEW_TYPE,
    example: NEW_TYPE.LATEST,
    required: true,
  })
  @IsDefined({ message: 'Vui lòng chọn loại tin tức.' })
  @IsEnum(NEW_TYPE, { message: 'Vui lòng chọn loại tin tức hợp lệ.' })
  type: number;

  @ApiProperty({
    description: 'Nội dung chi tiết (định dạng JSON)',
    example: {
      time: 1761233762541,
      blocks: [
        {
          id: 'nY17axg5B2',
          type: 'paragraph',
          data: {
            text: 'Thường xuất hiện chấm nhỏ màu xanh xám nhạt trên lá...',
          },
        },
        {
          id: 'EaVGKy1nSf',
          type: 'image',
          data: {
            caption: 'Bệnh đạo ôn lúa',
            file: {
              url: 'http://localhost:4002/uploads/diseases/images/23-10-2025/6c860d0a.png',
            },
          },
        },
      ],
      version: '2.31.0',
    },
    required: true,
    type: Object,
  })
  @IsDefined({ message: 'Vui lòng nhập nội dung.' })
  @IsNotEmpty({ message: 'Vui lòng nhập nội dung.' })
  @IsObject({ message: 'Nội dung phải là JSON hợp lệ.' })
  content: Record<string, any>;

  @ApiProperty({
    description: 'Danh sách ID bệnh liên kết (có thể để trống)',
    example: [1, 2, 3],
    required: false,
    type: [Number],
    nullable: true,
  })
  @IsOptional()
  @IsArray({ message: 'Danh sách bệnh phải là mảng.' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Mỗi ID bệnh phải là số nguyên.' })
  disease_ids?: number[] | null;
}
