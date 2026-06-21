import { IsEmail, IsNotEmpty, IsString, IsOptional, Validate, IsDefined, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailUnique, IsPhoneUnique } from '../validators';
import { USER_TYPE } from 'utils/enum';

export class UpdateUserDto {
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: 'Tên của người dùng, không được để trống',
    example: 'Nguyen Van A',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập họ và tên.' })
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên.' })
  @IsString({ message: 'Vui lòng nhập họ và tên là chuỗi ký tự.' })
  name: string;

  @ApiProperty({
    description: 'Email của người dùng, bắt buộc phải là email hợp lệ',
    example: 'example@example.com',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập email.' })
  @IsNotEmpty({ message: 'Vui lòng nhập email.' })
  @IsEmail({}, { message: 'Vui lòng nhập email hợp lệ.' })
  @Validate(IsEmailUnique)
  email: string;

  @ApiProperty({
    description: 'Số điện thoại của người dùng, có thể để trống nhưng mặc định là null',
    example: '0901234567',
    required: false,
  })
  @IsString({ message: 'Vui lòng nhập chuỗi ký tự.' })
  @IsOptional()
  @Validate(IsPhoneUnique)
  phone?: string | null;

  @ApiProperty({
    description: 'Loại người dùng, không được để trống',
    example: USER_TYPE.USER,
    required: true,
  })
  @IsDefined({ message: 'Vui lòng chọn loại người dùng.' })
  @IsNotEmpty({ message: 'Vui lòng chọn loại người dùng.' })
  @IsEnum(USER_TYPE, { message: 'Vui lòng chọn loại người dùng hợp lệ.' })
  type: USER_TYPE;
}
