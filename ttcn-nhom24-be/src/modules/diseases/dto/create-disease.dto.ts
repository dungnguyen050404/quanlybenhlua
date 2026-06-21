import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsObject, IsOptional, IsString, Validate } from 'class-validator';
import { CheckNameDisease } from '../validators/check-name-disease.validator';

export class CreateDiseaseDto {
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: 'Tên bệnh, không được để trống',
    example: 'Bệnh đạo ôn',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập tên bệnh.' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên bệnh.' })
  @IsString({ message: 'Vui lòng nhập tên bệnh chuỗi hợp lệ.' })
  @Validate(CheckNameDisease)
  name: string;

  @ApiProperty({
    description: 'Khái niệm, không được để trống',
    example: 'Khái niệm về bệnh đạo ôn',
    required: true,
  })
  @IsOptional()
  @IsString({ message: 'Vui lòng nhập khái niệm chuỗi hợp lệ.' })
  definition?: string;

  @ApiProperty({
    description: 'Nội dung chi tiết (JSON)',
    example: {
      time: 1761233762541,
      blocks: [
        {
          id: 'nY17axg5B2',
          type: 'paragraph',
          data: {
            text: 'Thường xuất hiện chấm nhỏ màu xanh xám nhạt trên lá. Lâu dài, vết bệnh lớn dần có hình thoi có màu xám tro; xung quanh nâu đậm. Khi bệnh nặng các vết bệnh nối liền nhau làm cho lá bị cháy. Nơi bị nhiễm nặng có thể bị cháy trụi hoàn toàn, bộ rễ bị thối và lúa không hồi phục',
          },
        },
        {
          id: 'EaVGKy1nSf',
          type: 'image',
          data: {
            caption: 'bệnh ôn lúa',
            withBorder: false,
            withBackground: false,
            stretched: false,
            file: {
              url: 'http://localhost:4002/uploads/diseases/images/23-10-2025/6c860d0a-6e66-427d-b114-9d22b0baa713-benh-dao-on-hai-lua.png',
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
}
