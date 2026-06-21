import { IsDefined, IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STATUS_ACTIVE } from 'utils/enum';

export class StatusUserDto {
  @ApiProperty({
    description: 'Trạng thái của người dùng, không được để trống',
    example: STATUS_ACTIVE.ACTIVE,
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập trạng thái.' })
  @IsNumber({}, { message: 'Vui lòng nhập trạng thái hợp lệ.' })
  @IsNotEmpty({ message: 'Vui lòng nhập trạng thái.' })
  @IsIn(Object.values(STATUS_ACTIVE), {
    message: 'Vui lòng nhập trạng thái hợp lệ.',
  })
  status: number;
}
